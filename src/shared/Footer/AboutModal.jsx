import { Modal } from "antd";
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";
import "./AboutModal.scss";

const LINKEDIN_URL = "https://www.linkedin.com/in/wenceslaojosevillegas/";
const GITHUB_URL = "https://github.com/wevillegas";

const STACK = [
  ["Frontend", ["React 18", "Vite", "Ant Design", "React Router", "Axios", "Sass"]],
  ["Backend", ["Node.js", "Express", "JWT + cookie HttpOnly", "bcrypt", "Helmet", "CORS"]],
  ["Base de datos", ["MongoDB", "Mongoose"]],
  ["Deploy", ["Vercel", "Render"]],
];

export const AboutModal = ({ open, onClose }) => (
  <Modal visible={open} onCancel={onClose} footer={null} centered width={560} className="aboutModal">
    <header className="aboutHead">
      <span className="aboutStamp">Proyecto ficticio</span>
      <h2>Acerca de Big Burger</h2>
    </header>

    <div className="aboutBody">
      <p>
        <strong>Big Burger no existe.</strong> Es el proyecto final del curso de{" "}
        <strong>RollingCode School</strong>: la hamburguesería, los productos, la dirección y los
        teléfonos son inventados y no se puede comprar nada real.
      </p>

      <h3>Stack</h3>
      {STACK.map(([group, items]) => (
        <div className="aboutStack" key={group}>
          <span className="aboutGroup">{group}</span>
          <div className="aboutChips">
            {items.map((i) => <span className="aboutChip" key={i}>{i}</span>)}
          </div>
        </div>
      ))}

      <h3>Autor</h3>
      <div className="aboutAuthor">
        <div className="aboutAvatar">WV</div>
        <div>
          <strong>Wenceslao José Villegas</strong>
          <small>Desarrollador full stack · Tucumán, Argentina</small>
        </div>
      </div>
      <div className="aboutLinks">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer"><GithubOutlined /> GitHub</a>
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><LinkedinOutlined /> LinkedIn</a>
      </div>
    </div>
  </Modal>
);
