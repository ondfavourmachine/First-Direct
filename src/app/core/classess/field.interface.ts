export interface Validator {
  name: string;
  validator: any;
  message: string;
}
export interface FieldConfig {
  // label?: string;
  // name?: string;
  // inputType?: string;
  // options?: string[];
  // collections?: any;
  // type: string;
  // value?: any;
  // validations?: Validator[];

  FieldDescription?: string;
  FieldName?: string;
  FieldType?: string;
  LookupItems?: string[];
  Collections?: any;
  Ishidden?: boolean;
  Size?:any;
  ControlType: string;
  FieldValue?: any;
  InputSource?: any;
  InputSourceKey?: any;
  Required?: any;
  AmountEditable?: boolean;
  AmountField?: boolean;
  PopulateAmount?: boolean;
  Validations?: Validator[];
  ShowOnPaymentConfirmation?: boolean;
}
