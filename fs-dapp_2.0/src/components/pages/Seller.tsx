import { useAssetContext } from "../../contexts/AssetContext"
import { useEffect } from "react";
import { useConcilSessionContext } from "@/src/contexts/CouncilSessionContext"
import { useAppContext } from "../../contexts/AppContext"
import { useAccountContext } from "@/src/contexts/Account_Context";
import {BN,formatBalance} from '@polkadot/util';
import { Card} from 'antd';
import { List } from "antd";
import { Button  } from 'antd';
import { SellerData, AssetData,arrangeText0 } from "../../contexts/types";
const status0 =["EDITING","REVIEWING","VOTING"]

export default function Seller(){

    const {seller,assets,selected_asset,dispatch3} = useAssetContext();
    const { api, blocks, selectedAccount,accounts} = useAppContext();
    const { balance,infos,dispatch0 } = useAccountContext();
    const initAssetData:AssetData = {collection_id:0,item_id:0,owner_address:"",infos:""}
    const initSellerData:SellerData = {name:"",address:"",balance:""}
    

    function getAssetDatas(){
        if (!api||!selectedAccount) return;
        let assets0:AssetData[]=[];
        let seller0 = initSellerData;
        
    let who = selectedAccount.address;
    api.query.rolesModule.HouseSellerLog(who,(data:any)=>{
        if(!data) return;
        let data0 = data.toHuman();
        console.log(data0);
        let txt = arrangeText0(data0.infos,true);
        seller0.name = txt[0];
        seller0.address = selectedAccount.address;

        api.query.system.account(who, ({ data: free }: { data: { free: BN } }) => {
            formatBalance.setDefaults({ decimals: 11, unit: 'USD' });
            const free0 = formatBalance(free.free,{ withSi: true, withZero: false });
            
            dispatch0({ type: 'SET_BALANCE', payload: free0 });
            seller0.balance = free0;
            dispatch3({ type:'SET_SELLER' , payload:seller0});
          });

    });

    api.query.nfts.account.keys((all:any[])=>{

        all.forEach((key)=>{
            if (!key) return;
            let asset_data=initAssetData;         
            let datas = key.toHuman();
            let address0 = selectedAccount.address;
            if (datas[0].toString()===address0){
                asset_data.owner_address=datas[0];
                asset_data.collection_id=datas[1];
                asset_data.item_id=datas[2];
                api.query.onboardingModule.houses(datas[1],datas[2],(asset_infos:any)=>{
                    let infos0=asset_infos.toHuman();
                    let infos = `${infos0.infos.metadata}:${infos0.price}:${infos0.status}:${infos0.maxTenants}`;
                    asset_data.infos=infos;
                    assets0.push(asset_data);
                    console.log(asset_data.infos)
                })
            }
        }
    )
    dispatch3({ type: 'SET_ASSETS', payload:assets0});

    });
    }

   

    useEffect(()=>{
        getAssetDatas()
    },[api,selectedAccount,blocks])
    

    return(
        <div>Seller Page</div>
    )
}