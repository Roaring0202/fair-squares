import { useAssetContext } from "../../contexts/AssetContext"
import { useEffect } from "react";
import { useConcilSessionContext } from "@/src/contexts/CouncilSessionContext"
import { useAppContext } from "../../contexts/AppContext"
import {BN,formatBalance} from '@polkadot/util';
import { Card} from 'antd';
import { List } from "antd";
import { Button  } from 'antd';
import { SellerData, AssetData,DataType } from "../../contexts/types";
const status0 =["EDITING","REVIEWING","VOTING"]

export default function Seller(){

    const {seller,assets,selected_asset,dispatch3} = useAssetContext();
    const { api, blocks, selectedAccount,accounts} = useAppContext();

    const initAssetData:AssetData = {collection_id:0,item_id:0,owner_address:"",infos:""}
    const initSellerData:SellerData = {name:"",address:"",balance:""}
    

    function getAssetDatas(){
        if (!api||!selectedAccount) return;
        let assets:AssetData[]=[];
        let tdata:DataType[]=[]
    let who = selectedAccount.address;

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
                    console.log(asset_data.infos)
                })

            }

            
        }
    )
    });

    }

    useEffect(()=>{
        getAssetDatas()
    },[api,selectedAccount])
    

    return(
        <div>Seller Page</div>
    )
}