'use client';

import { Sidebar } from 'flowbite-react';
import {
  MdDashboard,
  MdSignalWifiStatusbarConnectedNoInternet4,
  MdRoomService,
  MdSupervisorAccount,
} from 'react-icons/md';
import { Link, NavLink } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { useAccountContext } from '../../contexts/Account_Context';


const logo = require('../../assets/android-chrome-192x192.png');
export default function SideBar() {
  const { role } = useAccountContext();
  const [r0,setR0]= useState<string[]>([])
  
  useEffect(()=>{
    let roles = role.map((x)=>
      x.toString()
    )
    setR0(roles)
  },[role])
  
  return (
    
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="items-center bg-pink-700 text-white px-2"
    >
      <Sidebar.Items className="bg-pink-700 ">
        <Sidebar.ItemGroup>
          <Link to="./">
            <img src={logo} alt="FairSquares logo" width={100} height={100} />
          </Link>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item labelColor="white" href="#" icon={MdDashboard} className="p-3">
            <NavLink to="dashboard">Dashboard</NavLink>
          </Sidebar.Item>
          <Sidebar.Collapse
            icon={MdSignalWifiStatusbarConnectedNoInternet4}
            label="Status"
            className="p-2"
          >
            <Sidebar.Item href="#">
              <NavLink to="roles">Roles</NavLink>
            </Sidebar.Item>
            <Sidebar.Item href="#">Assets</Sidebar.Item>
            <Sidebar.Item href="#">Referendums</Sidebar.Item>
          </Sidebar.Collapse>

          {(role.length>0)?(
          <Sidebar.Collapse icon={MdSupervisorAccount} label="Users" className="p-2">
            {(r0.includes("INVESTOR"))?(
              <Sidebar.Item href="#">
                <NavLink to="investors">Investors</NavLink>
                </Sidebar.Item>
            ):<p></p>}
            
            {(r0.includes("SELLER"))?(
            <Sidebar.Item href="#">
              <NavLink to="seller">Sellers</NavLink>
            </Sidebar.Item>
          ):<p></p>}

          {(r0.includes("TENANT"))?(
            <Sidebar.Item href="#">Tenants</Sidebar.Item>
          ):<p></p>}
          </Sidebar.Collapse>
           ):<p></p>}
          <Sidebar.Collapse icon={MdRoomService} label="Service Providers" className="p-2">
            <Sidebar.Item href="#">
            <NavLink to="council">Councils</NavLink>
            </Sidebar.Item>

            {(r0.includes("NOTARY"))?(
            <Sidebar.Item href="#">Notaries</Sidebar.Item>
          ):<p></p>}

            {(r0.includes("REPRESENTATIVE"))?(
            <Sidebar.Item href="#">Representatives</Sidebar.Item>
          ):<p></p>}
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
