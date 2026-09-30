import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import './Pagination.scss';

// ventana de páginas visibles alrededor de la actual, con "..." cuando hay más de las que entran
function getPageWindow(current, total) {
    const maxButtons = 5;
    if (total <= maxButtons) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = new Set([1, total, current, current - 1, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

    const withGaps = [];
    sorted.forEach((page, i) => {
        if (i > 0 && page - sorted[i - 1] > 1) withGaps.push('...');
        withGaps.push(page);
    });
    return withGaps;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = getPageWindow(currentPage, totalPages);

    return (
        <nav className="app-pagination" aria-label="Paginación">
            <button
                type="button"
                className="pagination-chip pagination-arrow"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Página anterior"
            >
                <LeftOutlined />
            </button>

            {pages.map((page, i) =>
                page === '...' ? (
                    <span className="pagination-ellipsis" key={`gap-${i}`}>…</span>
                ) : (
                    <button
                        type="button"
                        key={page}
                        className={`pagination-chip${page === currentPage ? ' active' : ''}`}
                        onClick={() => onPageChange(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                type="button"
                className="pagination-chip pagination-arrow"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Página siguiente"
            >
                <RightOutlined />
            </button>
        </nav>
    );
};
