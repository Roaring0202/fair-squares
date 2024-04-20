import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccountContext } from '../../contexts/Account_Context';
import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useConcilSessionContext } from '../../contexts/CouncilSessionContext';
import {BN,formatBalance} from '@polkadot/util';
import RolesApp from '../shared/modal';
import Referendum from '../shared/referendum';
import { Card, Col, Space } from 'antd';
import Identicon from '@polkadot/react-identicon';
//import { queryPublishedCredentials } from '../shared/Credentials';

export default function Roles() {
  const { api, blocks, selectedAccount, web3Name, credentials, dispatch } = useAppContext();
  const { role, balance, dispatch0 } = useAccountContext();
  const { role_in_session, dispatch1 } = useConcilSessionContext();

  useEffect(() => {
    if (!api || !selectedAccount) return;
    let address0 = selectedAccount.address;
    api.query.rolesModule.requestedRoles(address0, (data: any) => {
      let data0 = data.toHuman();
      if(data0) {
        //console.log(`requested roles:${data}`);
      let r_session = data0.role.toString();

      dispatch1({ type: 'SET_ROLE_IN_SESSION', payload: r_session });
      }else{
        dispatch1({ type: 'SET_ROLE_IN_SESSION', payload: `` });
      }

      api.query.backgroundCouncil.proposals((hash: string[]) => {
        
        if (hash.length > 0) {
          hash.forEach((x)=>{
            if(x.toString()===data0.proposalHash.toString()){
              
              api.query.backgroundCouncil.voting(x.toString(), (data: any) => {
                let data1 = data.toHuman();
                if (data1 !== null) {
                  let yes = data1.ayes.length;
                  let no = data1.nays.length;
                  dispatch1({ type: 'SET_AYES', payload: yes });
                  dispatch1({ type: 'SET_NAY', payload: no });
                }
              });
            }
          })
          
        }
      });
      
    });
    //console.log(`role in session:${role}`)
  }, [role_in_session,selectedAccount, blocks, dispatch1, api]);




  useEffect(() => {
    if (!api || !selectedAccount) return;
    let address0 = selectedAccount.address;

    dispatch0({ type: 'SET_ADDRESS', payload: address0 });
    api.query.rolesModule.accountsRolesLog(address0, (roles: string[]) => {
      let rl = roles;
      dispatch0({ type: 'SET_ROLES', payload: rl });
    });

    api.query.system.account(address0, ({ data: free }: { data: { free: BN } }) => {
      formatBalance.setDefaults({ decimals: 11, unit: 'USD' });
      const free0 = formatBalance(free.free,{ withSi: true, withZero: false });

      dispatch0({ type: 'SET_BALANCE', payload: free0 });
    });

   /*
    if (web3Name) {
      (async () => {
        let data_all = await queryPublishedCredentials(web3Name);
        if (data_all) {
          dispatch({ type: 'SET_ATTESTER', payload: data_all[0] });
          dispatch({ type: 'SET_CREDENTIALS', payload: data_all[1] });
        } else {
          dispatch({ type: 'SET_ATTESTER', payload: 'NONE' });
          dispatch({ type: 'SET_CREDENTIALS', payload: 'NONE' });
        }
      })();
    }*/
    
  }, [blocks,selectedAccount, api, dispatch0, dispatch1, dispatch]);

  return (
    <div className="p-10">
      <Space direction="horizontal" style={{ display: 'flex' }} align="center">
        <Col >
          <Card title="Your wallet" style={{ width: 320, height:200}}>
            {selectedAccount ? (
              <div>
                <p className="text-xl">
                  <Identicon
                    value={selectedAccount.address}
                    size={30}
                    theme={'polkadot'}
                    className="px-1 justify-center align-middle"
                  />
                  {' ' +
                    selectedAccount.meta.name +
                    ' | ' +
                    selectedAccount.address.slice(0, 6) +
                    '...' +
                    selectedAccount.address.slice(-6, -1)}
                </p>
                <p className="text-xl">
                  Balance: {!balance ? '0' : balance} 
                </p>
                <p className="text-xl">
                  Credentials: {!credentials ? 'No Credentials' : credentials}
                </p>
              </div>
            ) : (
              <div>No Wallet Connected...</div>
            )}
          </Card>
        </Col>

        <Col >
          <Card title="Status" style={{ width: 220, height:200}}>
            <h1>
              Your Roles:{' '}
              {!(role.length > 0)
                ? 'None'
                : role.map((value: string, index: number) => (
                    <p key={index} className="font-bold text-green-700 text-xl">
                      {value.toString()}
                    </p>
                  ))}
            </h1>
          </Card>
        </Col>

        <Col >
          <Card title="Requests status" size="default">
            <h1 className="flex flex-col px-4 ">
              Last Requested Role:{' '}
              <p className="font-bold text-red-800 text-xl">
                {!role_in_session || role.includes(role_in_session) ? 'None' : role_in_session}
              </p>
              <br />
              <div>
                <header>Referendum Status:</header>
                <p className="text-xl font-bold">
                  {!role_in_session || role.includes(role_in_session) ? (
                    'No active referendum'
                  ) : (
                    <Referendum />
                  )}
                </p>
              </div>
            </h1>
          </Card>
        </Col>

        <br />
        <br />

        <div className="flex flex-row items-start space-x-3 ">
          <RolesApp />
        </div>
      </Space>
    </div>
  );
}
