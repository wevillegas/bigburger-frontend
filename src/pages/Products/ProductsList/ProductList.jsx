import React from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

export const ProductList = ({ productsDBToList, deleteProduct, editModal }) => {

    if (productsDBToList.length === 0) {
        return <p className="admin-empty">No hay productos en esta categoría.</p>
    }

    return (
        <ul className="admin-product-grid">
            {productsDBToList.map((product) => (
                <li className="admin-product-card" key={product._id}>
                    <div className="admin-product-img-wrap">
                        <img src={product.IMG} alt={product.name} />
                        <span className="admin-product-tag">{product.categorie_id}</span>
                        <span className={`admin-product-stock${product.stock ? '' : ' is-out'}`}>
                            {product.stock ? 'En stock' : 'Sin stock'}
                        </span>
                    </div>
                    <div className="admin-product-info">
                        <h3>{product.name}</h3>
                        <p className="admin-product-description">{product.description}</p>
                        <div className="admin-product-footer">
                            <b className="admin-product-price">${product.price}</b>
                            <div className="admin-product-actions">
                                <button
                                    type="button"
                                    aria-label={`Editar ${product.name}`}
                                    onClick={() => editModal(product, product._id)}
                                >
                                    <EditOutlined />
                                </button>
                                <button
                                    type="button"
                                    className="danger"
                                    aria-label={`Eliminar ${product.name}`}
                                    onClick={() => deleteProduct(product, product._id)}
                                >
                                    <DeleteOutlined />
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}
