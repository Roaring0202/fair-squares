import React from 'react';
import { useConcilSessionContext } from '../../contexts/CouncilSessionContext';
import { useAppContext } from '../../contexts/AppContext';
import { Progress, Space } from 'antd';
import { useEffect } from 'react';

function Referendum() {
  const { selectedProposal, council_members,proposals,ayes,nay,dispatch1 } = useConcilSessionContext();
  const { api,selectedAccount,blocks,accounts } = useAppContext();
  
  const yes = Number(((ayes / council_members.length) * 100).toFixed(1));


  
  return (
    <div>
      {
        <Space wrap>
          <Progress type="circle" percent={yes} size={80}></Progress>
          {ayes + nay > 0 ? (
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
