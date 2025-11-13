import ReactPaginate from "react-paginate";

function CustomPagination({ pageCount, onPageChange, currentPage }) {
    return (
        <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={onPageChange}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            containerClassName="custom-pagination"
            activeClassName="custom-active"
            pageClassName="custom-page"
            previousClassName="custom-page"
            nextClassName="custom-page"
            disabledClassName="custom-disabled"
            
            /** ✅ This forces pagination UI to show selected page */
            forcePage={currentPage - 1}
        />
    );
}

export default CustomPagination;
