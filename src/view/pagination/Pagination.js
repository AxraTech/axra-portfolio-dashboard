import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  totals,
}) => {
  //console.log("object", currentPage, totalPages, onNextPage, onPrevPage);
  return (
    <div className="flex items-center justify-center mt-4 mb-10">
      <button
        className="px-3 py-1 mx-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        onClick={onPrevPage}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-3 py-1 mx-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        onClick={onNextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      <p>Totals - {totals}</p>
    </div>
  );
};

export default Pagination;
