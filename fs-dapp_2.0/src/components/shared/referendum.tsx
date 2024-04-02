import React from 'react';
import { useConcilSessionContext } from '../../contexts/CouncilSessionContext';
import { useAppContext } from '../../contexts/AppContext';
import { Progress, Space } from 'antd';

function Referendum() {
  const { selectedProposal, council_members,proposals,dispatch1 } = useConcilSessionContext();
  const { selectedAccount } = useAppContext();
  

  proposals.forEach((prop)=>{

    if(selectedAccount===prop.Referendum_account){
      dispatch1({type:'SET_SELECTED_PROPOSAL',payload:prop});


    }
  });
  if (!selectedProposal) return(
    <div>
      <p>No votes yet</p>
    </div>
  );
  const yes = Number(((selectedProposal.ayes / council_members.length) * 100).toFixed(1));
  console.log(`Number of yes:${selectedProposal.ayes}`)

  return (
    <div>
      {
        <Space wrap>
          <Progress type="circle" percent={yes} size={80}></Progress>
          {selectedProposal.ayes + selectedProposal.nay > 0 ? (
            <Progress type="circle" percent={100 - yes} size={80} status="exception"></Progress>
          ) : (
            <p>No votes yet</p>
          )}
        </Space>
      }
    </div>
  );
}

export default Referendum;
