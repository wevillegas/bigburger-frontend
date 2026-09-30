import { CloseOutlined } from '@ant-design/icons'
import { Card, Col, InputNumber, Modal, notification, Row } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PRODUCT_CATEGORIES } from '../../../constants/categories'
import './ProductHome.scss'
// import { URL } from '../../../constants/endpoints'

const URL = process.env.REACT_APP_API_URL;

const CATEGORIES = ["Todas", ...PRODUCT_CATEGORIES]

export const ProductHome = ({ bCount }) => {

    const [products, productsState] = useState([])
    const [activeCategory, setActiveCategory] = useState("Todas")
    useEffect(() => {
        loadProducts()
    }, []);



    // CARGAR PRODUCTOS
    const loadProducts = async () => {
        try {
            const response = await axios.get(`${URL}/products`);
            const productsDB = response.data.products

            productsState(productsDB);

        } catch (error) {
            Modal.error({
                title: 'ERROR',
                icon: <CloseOutlined style={{ color: "#FF0000" }} />,
                content: `Ocurrió un error al cargar los productos`,
                okText: 'Ok',

            })
        }
    }

    //Agregar al carrito
    const addToCart = (id) => {
        const productSelected = products.find(el => el._id == id)
        const inCart = JSON.parse(localStorage.getItem('inCart')) || []
        const itemInCart = inCart.find(item => item._id === productSelected._id)
        let newCart = [];
        itemInCart ?
            (
                newCart = inCart.map(item => item._id === productSelected._id ? { ...item, cantidad: item.cantidad + 1 } : item)

            )
            :
            (
                newCart = [...inCart, { ...productSelected, cantidad: 1, note: '' }]
            );
        notification['success']({
            message: 'Agregado al carrito',
            description:
                `${productSelected.name} agregado correctamente`,
            duration: 2,
            placement: 'topRight',
            top: 70
        });
        localStorage.setItem('inCart', JSON.stringify(newCart))

        bCount(newCart)

    }

    const filteredProducts = activeCategory === "Todas"
        ? products
        : products.filter(el => el.categorie_id === activeCategory)

    return (
        <>
            <div className="site-card-wrapper">
                <div className="category-filters">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip${activeCategory === cat ? ' active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <Row gutter={[16, 16]}>
                    {filteredProducts.map(el => (
                        <Col key={el._id} xs={24} sm={12} lg={8} xl={6}>
                            <Card className='card-container' bordered={false}>
                                <div className="card-img-wrap">
                                    <img src={el.IMG} alt={el.name} className="tableIMG" />
                                    <span className="card-tag">{el.categorie_id}</span>
                                </div>
                                <div className="card-info">
                                    <h3>{el.name}</h3>
                                    <p className="card-description">{el.description}</p>
                                    <div className="card-footer">
                                        <b className="card-price">${el.price}</b>
                                        <button className="add-btn" onClick={() => addToCart(el._id)}>Agregar</button>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))
                    }
                </Row>
            </div>
        </>
    )
}
