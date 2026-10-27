import { Modal } from "antd";
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";

const LINKEDIN_URL = "https://www.linkedin.com/in/wenceslaojosevillegas/";

const STACK = [
  ["Frontend", "React 18, Vite, Ant Design, React Router, Axios, Sass"],
  ["Backend", "Node.js, Express, JWT en cookie HttpOnly, bcrypt, Helmet, CORS"],
  ["Base de datos", "MongoDB con Mongoose"],
  ["Deploy", "Vercel (front) y Render (back)"],
];

export const AboutModal = ({ open, onClose }) => (
  <Modal visible={open} onCancel={onClose} footer={null} centered title="Acerca de">
    <p>
      <strong>Big Burger no existe.</strong> Es un proyecto de fin de curso de{" "}
      <strong>RollingCode School</strong>: la hamburguesería, los productos, las direcciones y los
      teléfonos son ficticios y no se puede comprar nada real.
    </p>
    <h4>Stack</h4>
    <ul>
      {STACK.map(([k, v]) => (
        <li key={k}><strong>{k}:</strong> {v}</li>
      ))}
    </ul>
    <h4>Autor</h4>
    <p>
      Wenceslao José Villegas, desarrollador full stack, Tucumán, Argentina.<br />
      <a href="https://github.com/wevillegas" target="_blank" rel="noreferrer"><GithubOutlined /> GitHub</a>
      {" · "}
      <a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><LinkedinOutlined /> LinkedIn</a>
    </p>
  </Modal>
);
