import BigNumber from 'bignumber.js';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import mintTokenInstanceArray from 'src/crypto/ethereum/utilities/token1instance';
import ethTokenInstanceArray from 'src/crypto/ethereum/utilities/tokeninstance';
import { PostNFT } from 'src/entity/post/nft.entity';
import { UserPost } from 'src/entity/post/post.entity';
import { Account } from 'src/entity/user/account.entity';
import { Coin } from 'src/entity/user/coin.entity';
import { PlatformWallets } from 'src/entity/user/platformWallet.entity';
import { Rates } from 'src/entity/user/rates.entity';
import { Rewards } from 'src/entity/user/reward.entity';
import { Transaction } from 'src/entity/user/transaction.entity';
import { User } from 'src/entity/user/user.entity';
import {
  EnumRewardStatus,
  EnumRewardsType,
  EnumTransactionStatus,
  EnumTransactionType,
} from 'src/entity/user/user.enum';
import { UserCoin } from 'src/entity/user/usercoin.entity';
import { Wallet } from 'src/entity/user/wallet.entity';
import { CreateMintDto } from 'src/post/dto/post.dto';
import {
  import { UserService } from 'src/user/user.service';
  decrypt,
  encrypt,
  getPrivateKeyAndSelectNetwork,
  getPrivateKeyAndSelectNetworkForMint,
  getPrivateKeyAndSelectNetworkForOwner,
  getPrivateKeyAndSelectNetworkForSale,
  selectNetwork,
} from 'src/utils/scripts';
import { PostRewards } from 'src/entity/reward/PostRewards.entity';
import { RewardTrack } from 'src/entity/reward/RewardTrack.entity';
import {
  AccountBalanceDto,
  CreateAccountDto,
  ImportAccountDto,
  SellDto,
  transferDto,
} from './dto/account.dto';

const p = process.env.precision;
// console.log(p);

@Injectable()
export class EthAccountService {
  constructor (
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) { }

  async createAccount(createAccountDto: CreateAccountDto, user: User) {
    const { name, walletId } = createAccountDto;
    const wallet = await Wallet.findOne({
      where: { userId: user.id, id: walletId },
      loadEagerRelations: true,
    });

    const coin = await Coin.findOne({
      where: { tokenName: 'ONE', type: 'ONE' },
    });
    if (!wallet) {
      throw new NotFoundException('WALLET_NOT_FOUND');
    }
    const ethweb3direct = await selectNetwork('ONE', '');
    const newAccount = ethweb3direct.eth.accounts.create();
    const account = new Account();
    account.encryptedPrivateKey = await encrypt(newAccount.privateKey);
    account.address = newAccount.address;
    account.name = name;
    account.type = 'ONE';
    account.userId = user.id;
    account.walletId = walletId;
    // account.coin = coin

    await account.save();
    return newAccount;
  }

  async importAccount(importAccountDto: ImportAccountDto) {
    const { privateKey } = importAccountDto;
    // try {
    //   const ethweb3direct = await selectNetwork('ETH', '')
    //   let account = ethweb3direct.eth.accounts.privateKeyToAccount(privateKey);
    //   return account;
    // } catch (err) {
    //   throw new NotFoundException(err.Error);
    // }
    console.log(await decrypt(privateKey));
  }

  async getAccountbalance(balanceDto: AccountBalanceDto) {
    const { address, tokenId } = balanceDto;
    const tokenObj = await this.userService.findCoin(tokenId, 'COIN');
    try {
      const web3direct = await selectNetwork(tokenObj.type, '');
      console.log(address);
      const balance = await web3direct.eth.getBalance(address);
      return { balance: balance, decimals: tokenObj.decimals };
    } catch (err) {
      console.log(err, 'err');

      throw new NotFoundException(err.Error);
    }
  }

  async getTokenbalance(balanceDto: AccountBalanceDto) {
    const { address, tokenId } = balanceDto;
    // console.log(address, 'Address', tokenId);
    const tokenObj = await this.userService.findCoin(tokenId, 'COIN');
    // console.log(tokenObj, 'tokenObj');
    try {
      const web3direct = await selectNetwork(tokenObj.type, tokenObj.address);
      // console.log(web3direct, 'web3direct =======================');
      const tokeninstance = new web3direct.eth.Contract(
        ethTokenInstanceArray,
        tokenObj.address,
      );
      // console.log(tokeninstance.methods, 'tokenInstance');

      const balance = await tokeninstance.methods
        .balanceOf(address)
        .call()
        .then(async (res) => {
          // console.log(res, 'Balance ==============================');
          return res;
        });

      // console.log(balance, tokenObj.decimals, '==================');
      return { balance: balance, decimals: tokenObj.decimals };
    } catch (err) {
      console.log('Inside Catch Block of Get Token Balance');
      console.log(err, ': Error');
      throw new NotFoundException(err.Errori, 'GET Token Balance');
    }
  }

  // async transferBalanceOrToken(balanceDto: transferDto, user: User) {
  //   const { to, amount, from, tokenId } = balanceDto;
  //   const account = await Account.findOne({ where: { address: from } });

  //   if (tokenId) {
  //     return await this.transferToken(balanceDto, user, account,EnumTransactionType.transfer);
  //   } else {
  //     return await this.transferBalance(balanceDto, user, account,EnumTransactionType.transfer);
  //   }
  // }

  async transferToken(
    balanceDto: transferDto,
    user: User,
    account,
    transactionType: EnumTransactionType,
    fromUserCoin: UserCoin,
    finalAmount,
  ) {
    const { to, amount, from, tokenId } = balanceDto;
    let result;
    console.log('insisde token');
    const amount1 = new BigNumber(amount);

    const tokenObj = await this.userService.findCoin(tokenId, 'COIN');

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = tokenObj.tokenName;
    transaction.type = tokenObj.type;
    transaction.from = fromUserCoin.address;
    transaction.to = to;
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.withdraw;
    transaction.coin = tokenObj;
    transaction.amount = amount.toString();
    await transaction.save();

    try {
      const web3 = await getPrivateKeyAndSelectNetwork(
        tokenObj.type,
        tokenObj.address,
        account.encryptedPrivateKey,
      );

      const tokeninstance = new web3.eth.Contract(
        ethTokenInstanceArray,
        tokenObj.address,
      );
      const nonce = await web3.eth.getTransactionCount(from);
      await tokeninstance.methods
        .transfer(to, finalAmount.toFixed(Number(p)))
        .send({ from: from, value: 0, nonce: nonce })
        .then(async (res) => {
          // console.log(res);

          await web3.eth
            .getTransaction(res.transactionHash)
            .then(async (transactions) => {
              //   console.log(transactions)
              //  console.log(transactions.blockNumber,transactions.value,res.transactionHash)

              transaction.txnHash = res.transactionHash;
              transaction.block = transactions.blockNumber;
              transaction.status = EnumTransactionStatus.completed;
              transaction.gasUsed = transactions.gas;
              transaction.timestamp = Math.floor(new Date().getTime() / 1000);
              await transaction.save();
              web3.currentProvider.engine.stop();
            });
        })
        .catch((err) => {
          web3.currentProvider.engine.stop();

          throw err;
        });
    } catch (err) {
      console.log(err.message);

      transaction.status = EnumTransactionStatus.failed;
      transaction.note = err.message;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      await transaction.save();
    }

    return transaction;
  }

  async transferBalance(
    balanceDto: transferDto,
    user: User,
    account,
    transactionType: EnumTransactionType,
    fromUserCoin: UserCoin,
    finalAmount,
  ) {
    const { to, amount, from, tokenId } = balanceDto;
    let result;
    const amount1 = new BigNumber(amount);
    const coinObj = await this.userService.findCoin(tokenId, 'COIN');

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = coinObj.tokenName;
    transaction.type = coinObj.type;
    transaction.from = fromUserCoin.address;
    transaction.to = to;
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.withdraw;
    transaction.coin = coinObj;
    transaction.amount = amount.toString();
    await transaction.save();

    try {
      const web3 = await getPrivateKeyAndSelectNetwork(
        coinObj.type,
        '',
        account.encryptedPrivateKey,
      );
      const nonce = await web3.eth.getTransactionCount(from);
      await web3.eth
        .sendTransaction({
          from: from,
          to: to,
          value: finalAmount.toFixed(Number(p)),
          nonce: nonce,
        })
        .then(async (res) => {
          console.log(res);
          result = res;

          await web3.eth
            .getTransaction(res.transactionHash)
            .then(async (transactions) => {
              // console.log(transactions.blockNumber,transactions.value,res.transactionHash)

              transaction.txnHash = res.transactionHash;
              transaction.block = transactions.blockNumber;
              transaction.status = EnumTransactionStatus.completed;
              transaction.gasUsed = transactions.gas;
              transaction.timestamp = Math.floor(new Date().getTime() / 1000);
              await transaction.save();
            });
          web3.currentProvider.engine.stop();
        })
        .catch((err) => {
          web3.currentProvider.engine.stop();
          throw err;
        });
    } catch (err) {
      transaction.status = EnumTransactionStatus.failed;
      transaction.note = err.message;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      await transaction.save();
      throw new InternalServerErrorException(err.message);

      //throw new NotFoundException(err.message);
    }
    return transaction;
  }

  async transferTokenFromOwner(
    balanceDto: transferDto,
    user: User,
    transactionType: EnumTransactionType,
    fromUserCoin: UserCoin,
    finalAmount,
  ): Promise<Transaction> {
    const { to, amount, from, tokenId } = balanceDto;
    let result;
    const amount1 = new BigNumber(amount);
    const tokenObj = await this.userService.findCoin(tokenId, 'COIN');

    const amountDivided = new BigNumber(amount)
      .multipliedBy(10 ** tokenObj.decimals)
      .toFixed(20); //  /10^18
    console.log('amountmultiplied', amountDivided);

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = tokenObj.tokenName;
    transaction.type = tokenObj.type;
    transaction.from = fromUserCoin.address;
    transaction.to = to;
    transaction.amount = amount.toString();
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.withdraw;
    transaction.coin = tokenObj;
    await transaction.save();

    console.log(amount.toString(), 'AMOUNTTT');

    try {
      const address = process.env.OWNER_ETH_ACCOUNT;
      const bal = await this.getTokenbalance({
        address: address,
        tokenId: tokenObj.id,
      });
      console.log(bal.balance, 'BALANCE');
      if (finalAmount.isGreaterThan(bal.balance)) {
        throw new InternalServerErrorException('PLATFORM_ERROR');
      }
      const web3 = await getPrivateKeyAndSelectNetworkForOwner(
        tokenObj.type,
        tokenObj.address,
        process.env.OWNER_ETH_PRIVATE_KEY,
      );
      const tokeninstance = new web3.eth.Contract(
        ethTokenInstanceArray,
        tokenObj.address,
      );

      const nonce = await web3.eth.getTransactionCount(address);

      console.log(finalAmount.toString());
      await tokeninstance.methods
        .transfer(to, finalAmount.toFixed(Number(p)))
        .send({ from: address, value: 0, nonce: nonce })
        .then(async (res) => {
          console.log(res);

          await web3.eth
            .getTransaction(res.transactionHash)
            .then(async (transactions) => {
              console.log(transactions);
              console.log(
                transactions.blockNumber,
                transactions.value,
                res.transactionHash,
              );

              transaction.txnHash = res.transactionHash;
              transaction.block = transactions.blockNumber;
              transaction.status = EnumTransactionStatus.completed;
              transaction.gasUsed = transactions.gas;
              transaction.timestamp = Math.floor(new Date().getTime() / 1000);
              await transaction.save();
              web3.currentProvider.engine.stop();
            });
        })
        .catch(async (err) => {
          web3.currentProvider.engine.stop();

          throw err;
        });
    } catch (err) {
      console.log('ERROR', err);
      transaction.status = EnumTransactionStatus.failed;
      transaction.note = err.message;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      await transaction.save();
      throw new InternalServerErrorException(err.message);
    }

    return transaction;
  }

  async transferBalanceFromOwner(
    balanceDto: transferDto,
    user: User,
    transactionType: EnumTransactionType,
    fromUserCoin: UserCoin,
    finalAmount,
  ) {
    const { to, amount, from, tokenId } = balanceDto;
    let result;
    const coinOj = await this.userService.findCoin(tokenId, 'COIN');

    const amount1 = new BigNumber(amount);

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = coinOj.tokenName;
    transaction.type = coinOj.type;
    transaction.from = fromUserCoin.address;
    transaction.to = to;
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.withdraw;
    transaction.coin = coinOj;
    transaction.amount = amount.toString();
    await transaction.save();
    try {
      const address = process.env.OWNER_ETH_ACCOUNT;
      const bal = await this.getAccountbalance({
        address: address,
        tokenId: coinOj.id,
      });
      console.log(bal.balance, 'BALANCE');
      if (amount1.isGreaterThan(bal.balance)) {
        throw new InternalServerErrorException('PLATFORM_ERROR');
      }
      const web3 = await getPrivateKeyAndSelectNetworkForOwner(
        coinOj.type,
        '',
        process.env.OWNER_ETH_PRIVATE_KEY,
      );
      const nonce = await web3.eth.getTransactionCount(from);
      // console.log(nonce, amount.toString(), amount.toFixed(0), amount.toPrecision(0))
      console.log(amount1, nonce);

      await web3.eth
        .sendTransaction({
          from: address,
          to: to,
          value: finalAmount.toFixed(Number(p)),
          nonce: nonce,
        })
        .then(async (res) => {
          console.log(res);

          await web3.eth
            .getTransaction(res.transactionHash)
            .then(async (transactions) => {
              console.log(
                transactions.blockNumber,
                transactions.value,
                res.transactionHash,
              );

              transaction.txnHash = res.transactionHash;
              transaction.block = transactions.blockNumber;
              transaction.status = EnumTransactionStatus.completed;
              transaction.gasUsed = transactions.gas;
              transaction.timestamp = Math.floor(new Date().getTime() / 1000);
              await transaction.save();
            });

          web3.currentProvider.engine.stop();
        })
        .catch(async (err) => {
          web3.currentProvider.engine.stop();

          throw err;
        });
    } catch (err) {
      console.log('PLATFORM_ERROR');

      transaction.status = EnumTransactionStatus.failed;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      transaction.note = err.message;
      await transaction.save();
      throw new InternalServerErrorException(err.message);
    }

    return transaction;
  }

  // async getTransactionHistory(transhistoryDto: TransactionHistoryDto) {
  //   const { address, page, offset } = transhistoryDto;
  //   let result;
  //   const apiUrl = await selectApiUrl('ETH')
  //   const apiKey = await selectApiKey('ETH')
  //   console.log(page, offset, apiUrl)
  //   try {
  //     await axios
  //       .get(
  //         `${apiUrl}?module=account&action=txlist&address=0x8f69ae4211E64d58Bce7eaa8455ECeeAdb2787F5&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${apiKey}`
  //       )
  //       .then(async (res) => {
  //         console.log(res.data)
  //         result = res.data.result;
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         logger.error(`  errror in getTransactionhistory   ETH service${address} `,{error:err,errormessage:err.message,dateTime:new Date().toISOString()} ,{ service :UserService.name });
  //       });
  //   } catch (err) {
  //     logger.error(`  errror in getTransactionhistory   ETH service${address} `,{error:err,errormessage:err.message,dateTime:new Date().toISOString()} ,{ service :UserService.name });
  //     throw new NotFoundException(err.Error);

  //   }
  //   return result;
  // }

  // async trackCoinTransaction(trackTransactionDto: TrackTransactionDto, user:User ) {
  //   const { address, tokenId } = trackTransactionDto;
  //   const tokenObj = await this.userService.findCoin(tokenId,'COIN');
  //   const userCoin = await UserCoin.findOne({where:{address:address,coinId:tokenId}});
  //   const apiUrl = await selectApiUrl(tokenObj.type)
  //   const apiKey = await selectApiKey(tokenObj.type)
  //   let results
  //   try {
  //     await axios
  //       .get(
  //         `${apiUrl}?module=account&action=txlist&address=${address}&startblock=${userCoin.latestTxn}&sort=desc&apikey=${apiKey}`
  //       )
  //       .then(async (res) => {
  //         results = res.data.result;
  //         if(results && results.length){
  //           for(let i=0; i<results.length; i++){
  //             console.log(results[i])

  //             if((results[i].to).toLowerCase() == address.toLowerCase()){

  //               console.log((process.env.OWNER_ETH_ACCOUNT_GAS).toLowerCase(), "gas account",results[i].from.toLowerCase())

  //               if((results[i].from).toLowerCase() == (process.env.OWNER_ETH_ACCOUNT_GAS).toLowerCase()){
  //                 console.log("ignored")
  //               }else{
  //                 const transaction = await Transaction.findOne({where:{txnHash:results[i].hash, transactionType: EnumTransactionType.deposit}})
  //                 if(!transaction){
  //                   try{
  //                     await this.saveTransactionAndUpdateBalance(results[i],userCoin,tokenObj, user)
  //                   }catch (err) {
  //                     logger1.error(`  errror in trackcointransaction   ETH service${address} &&${tokenId} `,{error:err,errormessage:err.message,dateTime:new Date().toISOString()} ,{ service :UserService.name });
  //                     console.log(err, "this occured while saving the data")
  //                     continue;
  //                   }
  //                 }
  //                 else{
  //                   //check if balance is updated (completed)
  //                 }
  //               }
  //             }
  //              if(i == 0){
  //               userCoin.latestTxn = results[i].blockNumber
  //               await userCoin.save()
  //             }
  //         }
  //       }
  //       })
  //       .catch((err) => {
  //         logger1.error(`  errror in trackcointransaction   ETH service${address} &&${tokenId} `,{error:err,errormessage:err.message,dateTime:new Date().toISOString()} ,{ service :UserService.name });
  //         console.log(err);
  //       });
  //   } catch (err) {
  //     logger1.error(`  errror in trackcointransaction   ETH service${address} &&${tokenId} `,{error:err,errormessage:err.message,dateTime:new Date().toISOString()} ,{ service :UserService.name });
  //     throw new NotFoundException(err.Error);
  //   }
  //   return userCoin
  // }

  // async trackTokenTransaction(trackTransactionDto: TrackTransactionDto, user:User ) {
  //   const { address, tokenId } = trackTransactionDto;
  //   const tokenObj = await this.userService.findCoin(tokenId,'COIN');
  //   const userCoin = await UserCoin.findOne({where:{address:address, coinId:tokenId}});
  //   const apiUrl = await selectApiUrl(tokenObj.type)
  //   const apiKey = await selectApiKey(tokenObj.type)

  //   let results
  //   try {
  //     await axios
  //       .get(
  //         `${apiUrl}?module=account&action=tokentx&contractaddress=${tokenObj.address}&address=${address}&startblock=${userCoin.latestTxn}&sort=desc&apikey=${apiKey}`
  //       )
  //       .then(async (res) => {
  //         results = res.data.result;
  //         if(results && results.length){
  //           for(let i=0; i<results.length; i++){
  //             console.log(results[i],"results[i]" )

  //             if((results[i].to).toLowerCase() == address.toLowerCase()){

  //               console.log((process.env.OWNER_ETH_ACCOUNT_GAS).toLowerCase(), "gas account",results[i].from.toLowerCase())

  //               if((results[i].from).toLowerCase() == (process.env.OWNER_ETH_ACCOUNT_GAS).toLowerCase()){
  //                 console.log("ignored")
  //               }else{
  //               const transaction = await Transaction.findOne({where:{txnHash:results[i].hash, transactionType: EnumTransactionType.deposit}})
  //               if(!transaction){
  //                 try
  //                 {
  //                   await this.saveTransactionAndUpdateBalance(results[i],userCoin,tokenObj, user)
  //                 }
  //                 catch (err) {
  //                   logger1.error(`  errror in trackTokentransaction    ETH service   while saving data${address} &&${tokenId} `,{error:err,errormessage:err.message,dateTime:new Date().toISOString()} ,{ service :UserService.name });
  //                   console.log(err, "this occured while saving the data")
  //                   continue;
  //                 }
  //               }
  //               else{
  //                 //check if balance is updated (completed)
  //               }
  //               }
  //             }
  //             if(i == 0){
  //               userCoin.latestTxn = results[i].blockNumber
  //               await userCoin.save()
  //             }
  //         }
  //       }
  //       })
  //       .catch((err) => {
  //         logger1.error(`  errror in tracktokentransaction   ETH service${address} &&${tokenId} `,{error:err,dateTime:new Date().toISOString()} ,{ service :UserService.name });
  //         console.log(err);
  //       });
  //   } catch (err) {
  //     logger1.error(`  errror in tracktokentransaction   ETH service${address} &&${tokenId} `,{error:err,dateTime:new Date().toISOString()} ,{ service :UserService.name });
  //     throw new NotFoundException(err.Error);
  //   }
  //   return userCoin
  // }

  // async saveTransactionAndUpdateBalance(result:any, userCoin: UserCoin, tokenObj:Coin, user:User){
  //   const transaction = new Transaction()
  //   transaction.txnHash = result.hash;
  //   transaction.block = result.blockNumber;
  //   transaction.status =EnumTransactionStatus.processing
  //   transaction.tOrCName = tokenObj.tokenName;
  //   transaction.type = tokenObj.type;
  //   transaction.from = result.from;
  //   transaction.to = userCoin.address;
  //   transaction.amount = result.value;
  //   transaction.user = user;
  //   transaction.gasUsed = result.gasUsed;
  //   transaction.timestamp = result.timeStamp
  //   transaction.transactionType =EnumTransactionType.deposit
  //   transaction.coin = tokenObj

  //   await transaction.save();

  //   let currentBalance = new BigNumber(userCoin.amount) //decimal number
  //   let currentBalanceDivided = currentBalance.dividedBy((10**tokenObj.decimals)) // non decimal number

  //   let depositBalance = new BigNumber(result.value) //decimal number
  //   let depositBalanceDivided = depositBalance.dividedBy((10**tokenObj.decimals)) // non decimal number

  //   console.log(currentBalanceDivided, depositBalanceDivided, "current", "deposited")

  //   let finalBalance = currentBalanceDivided.plus(depositBalanceDivided)

  //   userCoin.amount = finalBalance.multipliedBy((10**tokenObj.decimals)).toString()

  //   userCoin.blockchainBalance = (new BigNumber(userCoin.blockchainBalance).plus(depositBalance)).toString()

  //   console.log(userCoin.amount, "finalBalance")
  //   await userCoin.save()

  //   transaction.status =EnumTransactionStatus.completed
  //   await transaction.save()

  //   return transaction

  // }

  async MintNFT(createMintDto: CreateMintDto, user: User, link: any) {
    let result;
    const { id, to } = createMintDto;

    try {
      const address = process.env.OWNER_MINT_ACCOUNT;
      const contractadds = process.env.MINT_CONTRACT_ADDRESS;

      // console.log(address);
      // console.log(contractadds,'contractadd');
      // console.log(process.env.OWNER_MINT_PRIVATE_KEY);

      const web3 = await getPrivateKeyAndSelectNetworkForMint(
        address,
        process.env.OWNER_MINT_PRIVATE_KEY,
      );
      const tokeninstance = new web3.eth.Contract(
        mintTokenInstanceArray,
        contractadds,
      );

      const amount = Number(1);

      const data = '0x';
      const tokenuri = link;
      console.log(tokenuri);

      const nonce = await web3.eth.getTransactionCount(address);
      await tokeninstance.methods
        ._mint(to, id, amount, data, tokenuri)
        .send({ from: process.env.OWNER_MINT_ACCOUNT, value: 0, nonce: nonce })
        .then(async (res) => {
          console.log(res);

          await web3.eth
            .getTransaction(res.transactionHash)
            .then(async (transactions) => {
              // console.log(transactions)
              console.log(
                'transactions',
                transactions.blockNumber,
                transactions.value,
                res.transactionHash,
              );

              result = res;
              web3.currentProvider.engine.stop();
            });
        })
        .catch(async (err) => {
          web3.currentProvider.engine.stop();

          throw err;
        });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    return result;
  }

  async saleNft(
    balanceDto: SellDto,
    user: User,
    transactionType: EnumTransactionType,
    fromUserCoin: UserCoin,
    toUser,
  ) {
    const { to, amount, from, tokenId, id } = balanceDto;
    let result;
    console.log('insisde token');
    const amount1 = new BigNumber(amount);

    const findPost = await UserPost.findOne({ where: { id: id } });

    const account = await Account.findOne({
      where: { address: from, userId: user.id },
    });

    const tokenObj = await this.userService.findCoin(tokenId, 'COIN');

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = tokenObj.tokenName;
    transaction.type = tokenObj.type;
    transaction.from = fromUserCoin.address;
    transaction.to = to;
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.sale;
    transaction.coin = tokenObj;
    transaction.amount = amount.toString();
    await transaction.save();

    try {
      const contractadds = process.env.MINT_CONTRACT_ADDRESS;

      // console.log(address);
      // console.log(contractadds,'contractadd');
      // console.log(process.env.OWNER_MINT_PRIVATE_KEY);

      const web3 = await getPrivateKeyAndSelectNetworkForSale(
        from,
        account.encryptedPrivateKey,
      );

      const tokeninstance = new web3.eth.Contract(
        mintTokenInstanceArray,
        contractadds,
      );
      const amount = Number(1);

      const data = '0x';

      const nonce = await web3.eth.getTransactionCount(from);
      await tokeninstance.methods
        .safeTransferFrom(from, to, id, amount, data)
        .send({ from: from, value: 0, nonce: nonce })
        .then(async (res) => {
          console.log(res, 'successfull');

          await web3.eth
            .getTransaction(res.transactionHash)
            .then(async (transactions) => {
              console.log('checking transaction', transactions);
              console.log(
                transactions.blockNumber,
                transactions.value,
                res.transactionHash,
              );

              transaction.txnHash = res.transactionHash;
              transaction.block = transactions.blockNumber;
              transaction.status = EnumTransactionStatus.completed;
              transaction.gasUsed = transactions.gas;
              transaction.timestamp = Math.floor(new Date().getTime() / 1000);
              await transaction.save();

              const nfttransfer = new PostNFT();
              nfttransfer.userPost = findPost;
              nfttransfer.to = to;
              nfttransfer.salePrice = findPost.salePrice;
              nfttransfer.metaDatafile = findPost.metaDatafile;
              nfttransfer.sold = true;
              nfttransfer.from = from;
              nfttransfer.block = transactions.blockNumber;
              nfttransfer.txnHash = res.transactionHash;
              nfttransfer.gasUsed = transactions.gas;
              nfttransfer.status = EnumTransactionStatus.completed;
              nfttransfer.user = toUser;
              await nfttransfer.save();
              findPost.onSale = false;
              findPost.salePrice = null;
              findPost.ownerAddress = to;
              findPost.owner = toUser;
              await findPost.save();
              web3.currentProvider.engine.stop();
            });
        })
        .catch((err) => {
          web3.currentProvider.engine.stop();

          throw err;
        });
    } catch (err) {
      console.log(err.message);

      transaction.status = EnumTransactionStatus.failed;
      transaction.note = err.message;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      await transaction.save();
    }

    return transaction;
  }

  async sendOnboardingRewads(user: User) {
    let result;
    const reward = await Rates.findOne({ type: 'onboardingReward' });
    const amount1 = new BigNumber(reward.rate);
    console.log(amount1);

    const tokenObj = await Coin.findOne({
      where: { tokenName: 'Galaxii', type: 'HRC20' },
    });
    const finalAmount = amount1.multipliedBy(10 ** tokenObj.decimals);

    const finduserAccount = await Account.findOne({ userId: user.id });

    const to = finduserAccount.address;

    const address = process.env.OWNER_ETH_ACCOUNT;

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = tokenObj.tokenName;
    transaction.type = tokenObj.type;
    transaction.from = address;
    transaction.to = to;
    transaction.amount = amount1.toString();
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.onboardReward;
    transaction.coin = tokenObj;
    await transaction.save();

    const rewards = new Rewards();
    rewards.amount = reward.rate;
    rewards.status = EnumRewardStatus.processing;
    rewards.from = address;
    rewards.toUser = user;
    rewards.to = to;
    rewards.tOrCName = tokenObj.tokenName;
    rewards.type = 'HRC20';
    rewards.rewardsType = EnumRewardsType.onboardReward;
    await rewards.save();

    try {
      const bal = await this.getTokenbalance({
        address: address,
        tokenId: tokenObj.id,
      });
      console.log(bal.balance, 'BALANCE');
      if (amount1.isGreaterThan(bal.balance)) {
        throw new InternalServerErrorException('PLATFORM_ERROR');
      }
      const web3 = await getPrivateKeyAndSelectNetworkForOwner(
        tokenObj.type,
        tokenObj.address,
        process.env.OWNER_ETH_PRIVATE_KEY,
      );
      const tokeninstance = new web3.eth.Contract(
        ethTokenInstanceArray,
        tokenObj.address,
      );

      const nonce = await web3.eth.getTransactionCount(address);

      // console.log(finalAmount.toString())
      await tokeninstance.methods
        .transfer(to, finalAmount.toFixed(Number(p)))
        .send({ from: address, value: 0, nonce: nonce })
        .then(async (res) => {
          console.log(res);

          await web3.eth
            .getTransaction(res.transactionHash)
            .then(async (transactions) => {
              console.log(transactions);
              console.log(
                transactions.blockNumber,
                transactions.value,
                res.transactionHash,
              );

              transaction.txnHash = res.transactionHash;
              transaction.block = transactions.blockNumber;
              transaction.status = EnumTransactionStatus.completed;
              transaction.gasUsed = transactions.gas;
              transaction.timestamp = Math.floor(new Date().getTime() / 1000);
              await transaction.save();

              rewards.txnHash = res.transactionHash;
              rewards.block = transactions.blockNumber;
              rewards.status = EnumRewardStatus.completed;
              rewards.gasUsed = transactions.gas;
              rewards.timestamp = Math.floor(new Date().getTime() / 1000);
              rewards.transaction = transaction;
              rewards.save();
              web3.currentProvider.engine.stop();
            });
        })
        .catch(async (err) => {
          web3.currentProvider.engine.stop();

          throw err;
        });
    } catch (err) {
      console.log('ERROR', err);
      transaction.status = EnumTransactionStatus.failed;
      transaction.note = err.message;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      await transaction.save();
      rewards.status = EnumRewardStatus.failed;
      rewards.note = err.message;
      rewards.timestamp = Math.floor(new Date().getTime() / 1000);
      rewards.save();
      throw new InternalServerErrorException(err.message);
    }

    return transaction;
  }

  async transferFeesTowallets(amount: string) {
    let result;
    // let reward=  await Rates.findOne({type:"onboardingReward"})
    const amount1 = new BigNumber(amount);
    console.log(amount1);

    const user = await User.findOne({ where: { role: 'Admin' } });

    const tokenObj = await Coin.findOne({
      where: { tokenName: 'Galaxii', type: 'HRC20' },
    });
    const finalAmount = amount1.multipliedBy(10 ** tokenObj.decimals);

    const finduserAccount = await PlatformWallets.findOne({
      WalletType: 'DAO',
    });

    const to = finduserAccount.walletAddress;

    const address = process.env.OWNER_ETH_ACCOUNT;

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = tokenObj.tokenName;
    transaction.type = tokenObj.type;
    transaction.from = address;
    transaction.to = to;
    transaction.amount = amount1.toString();
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.feesTransferDAO;
    transaction.coin = tokenObj;
    await transaction.save();

    try {
      const bal = await this.getTokenbalance({
        address: address,
        tokenId: tokenObj.id,
      });
      console.log(bal.balance, 'BALANCE');
      if (amount1.isGreaterThan(bal.balance)) {
        throw new InternalServerErrorException('PLATFORM_ERROR');
      }
      const web3 = await getPrivateKeyAndSelectNetworkForOwner(
        tokenObj.type,
        tokenObj.address,
        process.env.OWNER_ETH_PRIVATE_KEY,
      );
      const tokeninstance = new web3.eth.Contract(
        ethTokenInstanceArray,
        tokenObj.address,
      );

      const nonce = await web3.eth.getTransactionCount(address);

      // console.log(finalAmount.toString())
      await tokeninstance.methods
        .transfer(to, finalAmount.toFixed(Number(p)))
        .send({ from: address, value: 0, nonce: nonce })
        .then(async (res) => {
          console.log(res);

          await web3.eth
            .getTransaction(res.transactionHash)
            .then(async (transactions) => {
              console.log(transactions);
              console.log(
                transactions.blockNumber,
                transactions.value,
                res.transactionHash,
              );

              transaction.txnHash = res.transactionHash;
              transaction.block = transactions.blockNumber;
              transaction.status = EnumTransactionStatus.completed;
              transaction.gasUsed = transactions.gas;
              transaction.timestamp = Math.floor(new Date().getTime() / 1000);
              await transaction.save();
              web3.currentProvider.engine.stop();
            });
        })
        .catch(async (err) => {
          web3.currentProvider.engine.stop();

          throw err;
        });
    } catch (err) {
      console.log('ERROR', err);
      transaction.status = EnumTransactionStatus.failed;
      transaction.note = err.message;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      await transaction.save();
      throw new InternalServerErrorException(err.message);
    }

    return transaction;
  }

  async transferFeesTowallets2(amount: string) {
    let result;
    // let reward=  await Rates.findOne({type:"onboardingReward"})
    const amount1 = new BigNumber(amount);
    console.log(amount1);

    const user = await User.findOne({ where: { role: 'Admin' } });

    const tokenObj = await Coin.findOne({
      where: { tokenName: 'Galaxii', type: 'HRC20' },
    });
    const finalAmount = amount1.multipliedBy(10 ** tokenObj.decimals);

    const finduserAccount = await PlatformWallets.findOne({
      WalletType: 'Reward',
    });

    const to = finduserAccount.walletAddress;

    const address = process.env.OWNER_ETH_ACCOUNT;

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = tokenObj.tokenName;
    transaction.type = tokenObj.type;
    transaction.from = address;
    transaction.to = to;
    transaction.amount = amount1.toString();
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.feesTransferReward;
    transaction.coin = tokenObj;
    await transaction.save();

    try {
      const bal = await this.getTokenbalance({
        address: address,
        tokenId: tokenObj.id,
      });
      console.log(bal.balance, 'BALANCE');
      if (amount1.isGreaterThan(bal.balance)) {
        throw new InternalServerErrorException('PLATFORM_ERROR');
      }
      const web3 = await getPrivateKeyAndSelectNetworkForOwner(
        tokenObj.type,
        tokenObj.address,
        process.env.OWNER_ETH_PRIVATE_KEY,
      );
      const tokeninstance = new web3.eth.Contract(
        ethTokenInstanceArray,
        tokenObj.address,
      );

      const nonce = await web3.eth.getTransactionCount(address);

      // console.log(finalAmount.toString())
      await tokeninstance.methods
        .transfer(to, finalAmount.toFixed(Number(p)))
        .send({ from: address, value: 0, nonce: nonce })
        .then(async (res) => {
          console.log(res);

          await web3.eth
            .getTransaction(res.transactionHash)
            .then(async (transactions) => {
              console.log(transactions);
              console.log(
                transactions.blockNumber,
                transactions.value,
                res.transactionHash,
              );

              transaction.txnHash = res.transactionHash;
              transaction.block = transactions.blockNumber;
              transaction.status = EnumTransactionStatus.completed;
              transaction.gasUsed = transactions.gas;
              transaction.timestamp = Math.floor(new Date().getTime() / 1000);
              await transaction.save();
              web3.currentProvider.engine.stop();
            });
        })
        .catch(async (err) => {
          web3.currentProvider.engine.stop();

          throw err;
        });
    } catch (err) {
      console.log('ERROR', err);
      transaction.status = EnumTransactionStatus.failed;
      transaction.note = err.message;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      await transaction.save();
      throw new InternalServerErrorException(err.message);
    }

    return transaction;
  }

  async BurnTokens(amount: string) {
    let result;
    // let reward=  await Rates.findOne({type:"onboardingReward"})
    const amount1 = new BigNumber(amount);
    console.log(amount1);

    const user = await User.findOne({ where: { role: 'Admin' } });

    const tokenObj = await Coin.findOne({
      where: { tokenName: 'Galaxii', type: 'HRC20' },
    });
    const finalAmount = amount1.multipliedBy(10 ** tokenObj.decimals);

    // const finduserAccount= await PlatformWallets.findOne({WalletType:""})

    const to = process.env.OWNER_ETH_ACCOUNT;

    const address = process.env.OWNER_ETH_ACCOUNT;

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = tokenObj.tokenName;
    transaction.type = tokenObj.type;
    transaction.from = address;
    transaction.to = to;
    transaction.amount = amount1.toString();
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.burn;
    transaction.coin = tokenObj;
    await transaction.save();

    try {
      // let bal = await this.getTokenbalance({address:address ,tokenId:tokenObj.id})
      // console.log(bal.balance,"BALANCE")
      // if(amount1.isGreaterThan(bal.balance)){
      //   throw new InternalServerErrorException("PLATFORM_ERROR")
      // }
      const web3 = await getPrivateKeyAndSelectNetworkForOwner(
        tokenObj.type,
        tokenObj.address,
        process.env.OWNER_ETH_PRIVATE_KEY,
      );
      const tokeninstance = new web3.eth.Contract(
        ethTokenInstanceArray,
        tokenObj.address,
      );

      const nonce = await web3.eth.getTransactionCount(address);

      // console.log(finalAmount.toString())
      await tokeninstance.methods
        .burn(finalAmount.toFixed(Number(p)))
        .send({ from: address, value: 0, nonce: nonce })
        .then(async (res) => {
          console.log(res);

          transaction.txnHash = res.transactionHash;
          //  transaction.block = transactions.blockNumber;
          transaction.status = EnumTransactionStatus.completed;
          //  transaction.gasUsed = transactions.gas;
          transaction.timestamp = Math.floor(new Date().getTime() / 1000);
          await transaction.save();
          web3.currentProvider.engine.stop();
        })
        .catch(async (err) => {
          web3.currentProvider.engine.stop();

          throw err;
        });
    } catch (err) {
      console.log('ERROR', err);
      transaction.status = EnumTransactionStatus.failed;
      transaction.note = err.message;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      await transaction.save();
      throw new InternalServerErrorException(err.message);
    }

    return transaction;
  }

  async transferToTokenHolders(amount: string) {
    let result;
    // let reward=  await Rates.findOne({type:"onboardingReward"})
    const amount1 = new BigNumber(amount);
    console.log(amount1);

    const user = await User.findOne({ where: { role: 'Admin' } });

    const tokenObj = await Coin.findOne({
      where: { tokenName: 'Galaxii', type: 'HRC20' },
    });
    const finalAmount = amount1.multipliedBy(10 ** tokenObj.decimals);

    const finduserAccount = await PlatformWallets.findOne({
      WalletType: 'TokenHolder',
    });

    const to = finduserAccount.walletAddress;
    const address = process.env.OWNER_ETH_ACCOUNT;

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = tokenObj.tokenName;
    transaction.type = tokenObj.type;
    transaction.from = address;
    transaction.to = to;
    transaction.amount = amount1.toString();
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.feeTransferTokenHolder;
    transaction.coin = tokenObj;
    await transaction.save();

    try {
      // let bal = await this.getTokenbalance({address:address ,tokenId:tokenObj.id})
      // console.log(bal.balance,"BALANCE")
      // if(amount1.isGreaterThan(bal.balance)){
      //   throw new InternalServerErrorException("PLATFORM_ERROR")
      // }
      const web3 = await getPrivateKeyAndSelectNetworkForOwner(
        tokenObj.type,
        tokenObj.address,
        process.env.OWNER_ETH_PRIVATE_KEY,
      );
      const tokeninstance = new web3.eth.Contract(
        ethTokenInstanceArray,
        tokenObj.address,
      );

      const nonce = await web3.eth.getTransactionCount(address);

      // console.log(finalAmount.toString())
      await tokeninstance.methods
        .distributereflections(finalAmount.toFixed(Number(p)))
        .send({ from: address, value: 0, nonce: nonce })
        .then(async (res) => {
          transaction.txnHash = res.transactionHash;
          //  transaction.block = transactions.blockNumber;
          transaction.status = EnumTransactionStatus.completed;
          //  transaction.gasUsed = transactions.gas;
          transaction.timestamp = Math.floor(new Date().getTime() / 1000);
          await transaction.save();
        })
        .catch(async (err) => {
          web3.currentProvider.engine.stop();

          throw err;
        });
    } catch (err) {
      console.log('ERROR', err);
      transaction.status = EnumTransactionStatus.failed;
      transaction.note = err.message;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      await transaction.save();
      throw new InternalServerErrorException(err.message);
    }

    return transaction;
  }
  
  async sendInteractionRewads(user: User) {
    const reward = await Rates.findOne({ type: 'interactionreward' });
    const amount1 = new BigNumber(reward.rate);
    // console.log(amount1);

    const tokenObj = await Coin.findOne({
      where: { tokenName: 'Galaxii', type: 'HRC20' },
    });
    const finalAmount = amount1.multipliedBy(10 ** tokenObj.decimals);
    const finduserAccount = await Account.findOne({ userId: user.id });
    const to = finduserAccount.address;
    const address = process.env.OWNER_ETH_ACCOUNT;

    const transaction = new Transaction();
    transaction.status = EnumTransactionStatus.processing;
    transaction.tOrCName = tokenObj.tokenName;
    transaction.type = tokenObj.type;
    transaction.from = address;
    transaction.to = to;
    transaction.amount = amount1.toString();
    transaction.user = user;
    transaction.transactionType = EnumTransactionType.interactionReward;
    transaction.coin = tokenObj;
    await transaction.save();

    const rewards = new Rewards();
    rewards.amount = reward.rate;
    rewards.status = EnumRewardStatus.processing;
    rewards.from = address;
    rewards.toUser = user;
    rewards.to = to;
    rewards.tOrCName = tokenObj.tokenName;
    rewards.type = 'HRC20';
    rewards.rewardsType = EnumRewardsType.interactionReward;
    await rewards.save();

    try {
      const bal = await this.getTokenbalance({
        address: address,
        tokenId: tokenObj.id,
      });
      console.log(bal.balance, '======= BALANCE');
      if (amount1.isGreaterThan(bal.balance)) {
        throw new InternalServerErrorException('PLATFORM_ERROR');
      }
      const web3 = await getPrivateKeyAndSelectNetworkForOwner(
        tokenObj.type,
        tokenObj.address,
        process.env.OWNER_ETH_PRIVATE_KEY,
      );
      const tokeninstance = new web3.eth.Contract(
        ethTokenInstanceArray,
        tokenObj.address,
      );

      const nonce = await web3.eth.getTransactionCount(address);

      // console.log(finalAmount.toString())
      await tokeninstance.methods
        .transfer(to, finalAmount.toFixed(Number(p)))
        .send({ from: address, value: 0 })
        .then(async (res) => {
          console.log('RESPONSE BLOCK =======');
          console.log(res);

          await web3.eth
            .getTransaction(res.transactionHash)
            .then(async (transactions) => {
              console.log(transactions, 'Transaction');
              console.log(
                transactions.blockNumber,
                transactions.value,
                res.transactionHash,
              );

              transaction.txnHash = res.transactionHash;
              transaction.block = transactions.blockNumber;
              transaction.status = EnumTransactionStatus.completed;
              transaction.gasUsed = transactions.gas;
              transaction.timestamp = Math.floor(new Date().getTime() / 1000);
              await transaction.save();

              rewards.txnHash = res.transactionHash;
              rewards.block = transactions.blockNumber;
              rewards.status = EnumRewardStatus.completed;
              rewards.gasUsed = transactions.gas;
              rewards.timestamp = Math.floor(new Date().getTime() / 1000);
              rewards.transaction = transaction;
              rewards.save();
              web3.currentProvider.engine.stop();
            });
        })
        .catch(async (err) => {
          console.error(err, 'Failed to Transfer');
          web3.currentProvider.engine.stop();
          throw err;
        });
    } catch (err) {
      console.log('ERROR IN SENDINTERACTIONREWARDS', err);
      transaction.status = EnumTransactionStatus.failed;
      transaction.note = err.message;
      transaction.timestamp = Math.floor(new Date().getTime() / 1000);
      await transaction.save();
      rewards.status = EnumRewardStatus.failed;
      rewards.note = err.message;
      rewards.timestamp = Math.floor(new Date().getTime() / 1000);
      rewards.save();
      throw new InternalServerErrorException(err.message);
    }

    return transaction;
  }

  //Cron Job For Interactions Reward, It will run every week on Sunday
  @Cron('10 * * * * *')
  async transferPostReward() {
    console.log('transferPostReward Running');
    // Selecting Only Posts Which Are Minted
    const mintPostOnly = await UserPost.find({ where: { mintNFT: true } });
    if (!mintPostOnly) {
    }
    await Rates.findOne({
      where: { rateType: 'likeReward' },
    });
    await Rates.findOne({
      where: { rateType: 'commentReward' },
    });

    mintPostOnly.forEach(async (post) => {
      //!Checking if the post already exists in the PostReward table
      const postRewardExists = await PostRewards.findOne({
        where: { postId: post.id },
      });
      const user = await User.findOne({ where: { id: post.userId } });
      if (postRewardExists) {
        // console.log('postRewardExists');
        //!Upadating the post details of Already Existing Post
        postRewardExists.postLikes = post.likeCount;
        postRewardExists.postComments = post.commentCount;
        postRewardExists.save();
      } else {
        //!Enter the details for Post Which Should Be Rewarded
        // console.log('postRewardDon;tExists');
        const postReward = new PostRewards();
        postReward.postId = post.id;
        postReward.postLikes = post.likeCount;
        postReward.postComments = post.commentCount;
        postReward.ownerAddress = post.ownerAddress;
        postReward.save();
      }

      //!Calculating the Reward to be transferred
      if (postRewardExists) {
        const rewardlogforPost = await RewardTrack.findOne({
          where: { postId: postRewardExists.postId },
        });
        // const rewardforlike =
        //   (postRewardExists.postLikes - rewardlogforPost.likeswithreward) *
        //   Number(likeReward.rate);
        // const rewardforcomment =
        //   (postRewardExists.postComments -
        //     rewardlogforPost.Commentswithreward) *
        //   Number(commentReward.rate);
        // console.log('Sending Reward =======');
        await this.sendInteractionRewads(user);
        //!Updating the RewardLog
        rewardlogforPost.likeswithreward = postRewardExists.postLikes;
        rewardlogforPost.Commentswithreward = postRewardExists.postComments;
        rewardlogforPost.save();
      } else {
        // const rewardforlike = post.likeCount * Number(likeReward.rate);
        // const rewardforcomment = post.commentCount * Number(commentReward.rate);
        // console.log('Sending Reward');
        await this.sendInteractionRewads(user);

        //!Creating New Entry in RewardTrack Table
        const rewardTrack = new RewardTrack();
        rewardTrack.postId = post.id;
        rewardTrack.likeswithreward = post.likeCount;
        rewardTrack.Commentswithreward = post.commentCount;
        rewardTrack.save();
      }
    });
  }
}
