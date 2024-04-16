import { useAccountContext } from '../../contexts/Account_Context';
import React, { useEffect,useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { arrangeText } from './Council';
import { InvestorData } from '@/src/contexts/types';



export default function Investors(){
    const { api, blocks, selectedAccount, web3Name, credentials, dispatch } = useAppContext();
  const { role, balance,investor, dispatch0 } = useAccountContext();
//Get user infos
const[idata,setIdatas] = useState<InvestorData|undefined>();



useEffect(()=>{
    if (!api||!selectedAccount) return;
    let address0=selectedAccount.address;
    api.query.rolesModule.investorLog(address0,(data:any)=>{
        let data0= data.toHuman();
        if(data0){
            let txt = data0.infos
            let infos = arrangeText(txt);

          //  let datas:InvestorData={name:infos[0],address:selectedAccount.address,balance:balance,fund_share:data0.share}
        }
    })
})

    return(
        <div>
            Investor Page
        </div>
    )
}