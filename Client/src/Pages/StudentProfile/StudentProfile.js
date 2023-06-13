import React, { useEffect, useState } from 'react'
import HeaderAuth from '../../Components/HeaderAuth'
import StudentProfileSideMenuCopy from './StudentProfileSideMenucopy'
import "./studentprofile.css"
import Duyurular from './duyurular.js'
import Notbilgisi from './notbilgisi'
import Devamsizlik from './devamsizlik'
import {
  getDevamsizlikTarihleri,
  getNotlar,
  getAnnouncements
} from "../../Api/StudentApi";
import { useSelector } from 'react-redux'

function StudentProfile() {
  const  token = useSelector((state) => state.userInformation.token);
  const [selected,setSelected]=useState("2");
  const [devamsizliklar, setDevamsizliklar] = useState([]);
  const [sinavlar, setSinavlar] = useState([]);
  const [duyurular, setDuyurular] = useState([]);
 

  useEffect(() => {
    if(selected==="1")
    {devamsizliklariCek()}
    if(selected==="2")
   { notlar()}
   if(selected==="2"){
    duyurulariCek()
  }
  
  }, [selected])

  const notlar = async () => {
     const notlarData = await getNotlar(token);
      setSinavlar(notlarData)
  };
  const devamsizliklariCek = async () => {
    const devamsizlikData = await getDevamsizlikTarihleri(token);
    setDevamsizliklar(devamsizlikData);
   
  };
  const duyurulariCek = async () => {
    const duyuruData = await getAnnouncements(token);
    setDuyurular(duyuruData);
  };


  const renderElement = (secili) => {
    if (secili === "1") {
      return <Devamsizlik devamsizliklar={devamsizliklar}/>
    } else if (secili === "2") {
      return  <Notbilgisi mat1={sinavlar.matematik1} mat2={sinavlar.matematik2} hb1={sinavlar.hayatBilgisi1} hb2={sinavlar.hayatBilgisi2} f1={sinavlar.fenBilgisi1} f2={sinavlar.fenBilgisi2}/>
    } 
    else
      return <Duyurular duyurular={duyurular}/>
  };




  
  return (
    <div className='container'>
     
    <HeaderAuth tur={"Ogrenci"}/>
    
    
    <div className='yana-al'>
    <StudentProfileSideMenuCopy setSelected={setSelected}/>
    <div className='main-body'>
   
    
      {renderElement(selected)}
      </div>
    </div>
    </div>
  )
}

export default StudentProfile