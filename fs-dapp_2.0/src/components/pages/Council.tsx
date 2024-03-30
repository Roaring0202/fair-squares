import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccountContext } from '../../contexts/Account_Context';
import React, { useEffect,useState,useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useConcilSessionContext } from '../../contexts/CouncilSessionContext';
import { DataType } from '@/src/contexts/types';
import BN from 'bn.js';
import { toUnit } from '../shared/utils';
import RolesApp from '../shared/modal';
import Referendum from '../shared/referendum';
import { Card, Col, Space } from 'antd';
import Identicon from '@polkadot/react-identicon';
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar,  Divider, List, Skeleton } from "antd";
import { Button } from 'flowbite-react';


export default function Council() {
  const { api, blocks, selectedAccount,accounts,  dispatch } = useAppContext();
  const { role, balance, dispatch0 } = useAccountContext();
  const { session_closed,approved,role_in_session,nay,ayes,council_members,selectedProposal,proposals, datas,dispatch1 } = useConcilSessionContext();
  const CODE_KEY = "0x98d32a3a7be412e9bda0bf02ccbdec683a1e528d74cc03d161a7a2fd1d02d98a"
  
 
  const [ln,setLn] = useState(0); 

  function getDatas(){
    let tdata:DataType[]=[]
    
    api?.query.rolesModule.requestedRoles.entries((all:any[])=>{
      

       all.forEach(([key, value]) => {
        let Prop = value.toHuman();
        if(!Prop) return;
        let acc0 = Prop.accountId;
        let acc1 = accounts.find((account) => account.address === acc0);
        if(!acc1) return;
        
        console.log(`names are:${acc1.meta.name}`)
        let r_session = Prop.role.toString();
      let status = Prop.approved.toString();
      let referendum = Prop.sessionClosed.toString();
      let hash = Prop.proposalHash.toString();
      let dtype:DataType={name:acc1.meta.name,role:r_session,address: Prop.accountId,status,referendum,hash};      
      tdata.push(dtype);      
              }
);

dispatch1({type:`SET_DATAS`,payload:tdata});
    });
    
  }

  const update = useCallback(() =>{  
    
    console.log(`Datas length before:${datas.length}`)
    let l= datas.length 
    getDatas();
    if(l!==datas.length){
      setLn(datas.length)
      
    }
    
  },[ln]);




   useEffect(() => {
    if (!api || !selectedAccount) return;
    
    getDatas();
    
    
    console.log(`Datas length after:${datas.length}`)
  }, [ln,selectedAccount]);

 

  return(<div id="scrollableDiv"
  style={{
    height: 400,
    overflow: 'auto',
    padding: '0 16px',
    border: '1px solid rgba(140, 140, 140, 0.35)',
  }}>
    
       <List
          dataSource={datas}
          
          renderItem={item => (
            <Card 
            hoverable
      style={{ width: 300, height:150}}>
            <List.Item key={item.address}>
              <List.Item.Meta
                title={<p>{item.name}</p>}
                description={<div><p>Requested Role: {item.role}</p><p>Request Status: {item.status}</p><p>Session is closed: {item.referendum}</p></div>}
              />
              <div>Content</div>
            </List.Item>
            </Card>
          )}

        />

   
    
  </div>);

  }