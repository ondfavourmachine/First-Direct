
export class addCustomer {
    customerName: string;
    industryId: number;
    // industryName: string;
    customerCode: string;
    tin: string;
    rcNumber: string;
    countryId: string;
    email: string;
    phoneNumber: string;
    tierId: number;
    limits: number;
    role: string;
    companyName: string;
    bankName: string;
    accountNumber: string;
    minimumAnnualSpend: number;
    maximumAnnualSpend: number;
    isEdited: boolean;
    accountName: string;
    }
export class editCustomer {
    id: number;
    customerName: string;
    categoryId: number;
    categoryName: string;
    companyName: string;
    customerType: string;
    customerCode: string;
    subsidiaryCode: string;
    industryId: number;
    industryName: string;
    email: string;
    phoneNumber: string;
    address1: string;
    address2: string;
    city: string;
    country: string;
    tin: string;
    rcNumber: string;
    tierId: number;
    tierName: string;
    limits: number;
    countryId: string;
    isActive: boolean;
    dateAdded: string;
    createdBy: string;
    maximumAnnualSpend: number;
    minimumAnnualSpend: 0;
    currencyCode: string;
    bankCode: string;
    bankName: string;
    swiftCode: string;
    accountName: string;
    accountNumber: string;
    status: string;
    }

    export class uploadCustomerFileModel {
        documentName: string;
        documentBaser64String: string;
    }

    export class validateBankDetailsModel {
       session: string;
       destinationAccount: string;
       destinationBankCode: string;
     }

     export class userRoleModel {
        session: string;
        username: string;
        subsidiaryId: string;
     }

     export class requestBodyModel {
       session:string;
       username:string;
       subsidiaryId:string;
       countryId:string;
       searchQuery:string;
       sortColumn:string;
       pageNumber: number;
       pageSize: number;
     }