import { Domain, DomainToTemplate, Feature, FeatureImage, Otp, ProfileImage,Project, ProjectToFeatures, Template, TemplateImage, TemplateToFeature, User } from "src/entities"
import { DataSource, DataSourceOptions } from "typeorm"

require("dotenv").config()

const host = process.env.DB_HOST
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
const username = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME
const sync = process.env.DB_SYNC && process.env.DB_SYNC === "true"

export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host,
  port,
  username,
  password,
  database,
  entities: [
    User,
    ProfileImage,
    Otp,
    Template,
    TemplateImage,
    Feature,
    FeatureImage,
    Domain,
    Project,
    TemplateToFeature,
    DomainToTemplate,
    ProjectToFeatures,
  ],
  synchronize: sync,

  logging: true,
  logger: "advanced-console",

  migrations: ["dist/config/migration/*.js"],
  // migrationsTableName: "migrations_typeorm",
  // migrationsRun: false,
}

const dataSource = new DataSource(dataSourceOptions)
dataSource
  .initialize()
  .then(() => {
    console.warn("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  console.log(dataSource.isInitialized)
  if (dataSource.isInitialized) return Promise.resolve(dataSource)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dataSource.isInitialized) resolve(dataSource)
      else reject("Failed to create connection with database")
    }, delay)
  })
}

export default dataSource
