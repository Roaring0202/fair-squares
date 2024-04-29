import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';

export type Address = string | undefined;
export type AccountRole = string[];

//Will deprecated
export interface AppState {
  api: ApiPromise | null;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | undefined;
  selectedAddress: Address;
  blocks: string;
  total_users_nbr: number;
  inv_nbr: number;
  seller_nbr: number;
  awaiting_seller_nbr: number;
  servicer_nbr: number;
  awaiting_servicer_nbr: number;
  tenant_nbr: number;
  treasury_balance: BN | undefined;
  web3Name: string | undefined;
  attester: string | undefined;
  credentials: string | undefined;
}

export interface AccountContextState {
  address: Address;
  role: AccountRole;
  balance: string | undefined;
  infos:string;
  investor:InvestorData|undefined;
}


export interface CouncilSessionContextState {
  approved: boolean;
  selectedProposal: Proposal | undefined;
  proposals:Proposal[];
  role_in_session: string;
  session_closed: boolean;
  ayes: number;
  nay: number;
  council_members: InjectedAccountWithMeta[];
  datas:DataType[]
}
export interface Proposal{
  voter_id: InjectedAccountWithMeta | undefined;
  Referendum_account: InjectedAccountWithMeta | undefined;
  session_closed: boolean;
  approved:boolean;
  ayes: number;
  nay: number;
  hash:string;
  infos:string;
}
export interface DataType {
  name: string|undefined;
  role: string;
  address:string;
  status:string;
  referendum:string;
  hash:string;
  infos:string; 
}

export interface InvestorData{
  name:string;
  address:string;
  balance: string;
  fund_share: string;
  available_funds:string;
  reserved_funds:string;
  invested_funds:string;
  
}

export interface AssetContextState{
  seller: SellerData|undefined;
  assets: AssetData[];
  selected_asset: AssetData|undefined;
}

export interface SellerData{
  name:string|undefined;
  address:string;
  balance: string;
}
export interface AssetData{
  collection_id: number,
  item_id:number,
  owner_address:string,
  infos:string,
}

export interface RolesData{
  total_users_nbr: number,
  inv_nbr: number,
  seller_nbr: number,
  awaiting_seller_nbr: number,
  servicer_nbr: number,
  awaiting_servicer_nbr: number,
  tenant_nbr: number,
}

export interface KiltData{
  web3Name: string | undefined,
  attester: string | undefined,
  credentials: string | undefined,
}

export interface ApiData{
  api: ApiPromise | null,
  accounts: InjectedAccountWithMeta[],
  selectedAccount: InjectedAccountWithMeta | undefined,
  selectedAddress: Address,
  blocks: string,
  treasury_balance: BN | undefined,

}
export const isRoleValid = (_role: string): boolean => {
  if (!_role) return false;
  return ROLES.indexOf(_role) !== -1;
};

export function arrangeText0(val:string, user:boolean){
  let alltxt=val.split(":");
  let output00=""
  if (user===true){
    output00=`FullName: ${alltxt[0]};E-MAIL: ${alltxt[2]};WebSite: ${alltxt[3]};Motivation: ${alltxt[4]};Additional Notes: ${alltxt[5]}`
  }else{
    output00=`Asset Name: ${alltxt[0]};Contact E-MAIL: ${alltxt[2]};WebSite: ${alltxt[3]}; Description: ${alltxt[4]};Additional Notes: ${alltxt[5]}`
  }
  
  let output0= output00.split(";")
  return output0
}

export const ROLES = ['INVESTOR', 'TENANT', 'SELLER', 'SERVICER', 'NOTARY', 'REPRESENTATIVE'];
export const ASSETS = ['HOUSES','OFFICES','APPARTMENTS']