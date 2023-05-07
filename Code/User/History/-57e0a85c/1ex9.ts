import {PropsWithChildren} from 'react';

export type ButtonProps = PropsWithChildren<{
  Label: string;
  OnPress?: any;
  Disabled?: boolean;
}>

export const LoginType = {
  EMAIL: 'email',
  MOBILE: 'mobile',
} as const;

export const InputFieldType = {
  EMAIL: 'Email',
  PASSWORD: 'Password',
  MOBILE: 'Mobile',
  PHONE: 'Phone',
  DOB: 'Dob',
  SELECT: 'Select',
  MULTISELECT: 'Multi-Selection',
  OTP: 'OTP',
  TEXTBOX: 'TextBox',
  NAME: 'Name',
  DATE: 'Date',
  RANGE: 'Range',
} as const;

export const ButtonSize = {
  SMALL: 'Small',
  MEDIUM: 'Medium',
  FULL: 'Full',
} as const;

