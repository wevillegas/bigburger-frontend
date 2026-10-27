import React, { useState } from 'react'
import "./Footer.scss"
import { AboutModal } from './AboutModal'
import { FacebookOutlined, GithubOutlined, InstagramOutlined, WhatsAppOutlined } from '@ant-design/icons'

export const Footer = () => {
  const [aboutOpen, setAboutOpen] = useState(false)
  return (
    <footer className='footer'>
      <div className="grupo-1">
        <div className="box">
          <figure className="footerMark">
            <span>BIGBURGER</span>
          </figure>
        </div>
        <div className="box">
          <h2>Dirección</h2>
          <p>Av. Los Naranjos 1234, San Miguel de Tucumán</p>
        </div>
        <div className="box">
          <h2>Contacto</h2>
          <p><WhatsAppOutlined /> 381 555-0142</p>
          <p><WhatsAppOutlined /> 381 555-0187</p>
        </div>
        <div className="box">
          <h2>Redes</h2>
          <div className="red-social">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><FacebookOutlined /></a>
            <a href="https://www.instagram.com/?hl=es-la" target="_blank" rel="noreferrer"><InstagramOutlined /></a>
            <a href="https://github.com/wevillegas" target="_blank" rel="noreferrer"><GithubOutlined /></a>
          </div>
        </div>
      </div>
      <div className="grupo-2">
        <small>&copy; <b>Big Burger</b> - Todos los Derechos Reservados. · <button type="button" className="aboutLink" onClick={() => setAboutOpen(true)}>Acerca de</button></small>
        <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      </div>
    </footer>
  )
}
