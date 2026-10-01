import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss"
import axios from "axios";
import { useAuth } from "../../auth/useAuth";
import { CheckCircleOutlined, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

const URL = process.env.REACT_APP_API_URL;

export const Login = () => {

  const auth = useAuth();
  const navigate = useNavigate();
  const onLogin = async (loginData)=>{
    auth.login(loginData)

  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const validationOn = true;
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const registerUser = async (formData)=>{
    try{
      const { data } =await axios.post(`${URL}/user`, formData)
      console.log("data ususario", data.usuarioNuevo)
      Modal.info({
        title: 'Cuenta creada',
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        content: `Tu cuenta se creó correctamente`,
        okText: 'Ok',
        okType: "ghost"

    })
    setIsModalVisible(false);
    onLogin(formData)
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="loginPage">
      <div className="loginBrand">
        <div className="loginBrand-mark">
          <svg width="40" height="40" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
            <polygon points="0,26 13,0 13,26" fill="var(--color3)" />
            <polygon points="13,26 13,0 26,26" fill="var(--color5)" />
          </svg>
          <div>
            <h1 className="wordmark">BIGBURGER</h1>
            <p className="wordmarkSub">Planta de pedidos N.º 01</p>
          </div>
        </div>

        <dl className="loginBrand-plate">
          <div>
            <dt>Módulo</dt>
            <dd>Pedidos &amp; cuenta</dd>
          </div>
          <div>
            <dt>Acceso</dt>
            <dd>Clientes y staff</dd>
          </div>
        </dl>
      </div>

      <div className="loginFormZone">
        <div className="loginCard">
          <span className="loginCard-tag">Ficha de acceso</span>
          <h2 className="loginCard-title">Iniciá sesión</h2>

          <Form
            name="login"
            layout="vertical"
            initialValues={{ remember: true }}
            autoComplete="on"
            className="loginForm"
            onFinish={onLogin}
            requiredMark={false}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: validationOn, message: "Ingresá tu email" }]}
            >
              <Input maxLength={30} placeholder="big@burger.com" prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: validationOn, message: "Ingresá tu contraseña" }]}
            >
              <Input.Password maxLength={30} prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item className="loginForm-submit">
              <Button type="primary" htmlType="submit" block>
                Ingresar
              </Button>
            </Form.Item>
          </Form>

          <div className="loginCard-divider" role="separator">
            <span>o</span>
          </div>

          <Button block onClick={() => navigate("/")}>
            Entrar como invitado
          </Button>

          <p className="loginCard-footer">
            ¿No tenés cuenta todavía? <a onClick={showModal}>Creá una</a>
          </p>
        </div>
      </div>

      {/*===== Modal de Registro ======*/}
      <Modal
        title="Crear cuenta"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="register"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={registerUser}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            label="Nombre completo"
            name="fullName"
            rules={[{ required: validationOn, message: "Ingresá un nombre válido" }]}
          >
            <Input maxLength={30} prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: validationOn, message: "Ingresá un email válido" },
              { type: 'email', message: 'Ingresá un email válido' },
            ]}
          >
            <Input maxLength={30} prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: validationOn, message: "Ingresá una contraseña" },
              { min: 8, message: "La contraseña debe tener 8 o más caracteres" },
            ]}
            hasFeedback
          >
            <Input.Password maxLength={30} prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirmar contraseña"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Repetí la contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item className="loginForm-submit">
            <Button type="primary" htmlType="submit" block>
              Crear cuenta
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
