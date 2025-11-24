import { buildSchema } from "graphql";
import { DonateModel } from "../schema/donate";

export const donate_Schema=buildSchema(`

    enum Payment_Status{
        SUCCESS
        FAILED
        PENDING
    }

    type Donate{
        id:ID!
        donator:String!
        contact:Int!
        address:String!
        transactionId:String!
        timestamp:String!
        amount:Float!
        payment_method:String!
        payment_status:Payment_Status!
        donation_type:String!
        isAnonymous:Boolean
        created_at: String!
        updated_at: String!
    }

    type query{
        getDonation(id:ID!):Donate
        getAllDonations:[Donate]
    }
    
    input InputDonate{
        donator:String!
        contact:Int!
        address:String!
        transactionId:String!
        timestamp:String!
        amount:Float!
        payment_method:String!
        payment_status:Payment_Status!
        donation_type:String!
        isAnonymous:Boolean
    }

    type Mutation{
        createDonation(input:InputDonate!):Donate
    }
`) 

export interface InputDonate{
    donator:string;
    contact:number;
    address:string;
    transactionId:string;
    timestamp:Date;
    amount:number;
    payment_method:string;
    payment_status:"SUCCESS" | "FAILED" | "PENDING";
    donation_type:string;
    isAnonymous:boolean;
    created_at:Date;
    updated_at:Date;
}

export const Donate={

    getDonation:async ({id}:{id:string})=>{
        const data=await DonateModel.findById(id).lean();
        return data;
    },

    getAllDonation:async ()=>{
        const data=await DonateModel.find().lean();
        return data;
    },

    createDonation:async ({input}:{input:InputDonate})=>{
        const donation=new DonateModel(input);
        const saved=await donation.save();
        return saved;
    }
    
}