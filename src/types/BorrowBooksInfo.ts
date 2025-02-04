export interface BorrowBooksInfo {
  //书的条形码
  barcode: string;
  loanDate: string;
  //该次借阅的id(每次借阅都会生成一个id)
  loanId: string;
  locationName: string;
  //规定归还时间
  normReturnDate: string;
  //实际归还时间(已归还时才会有)
  returnDate: string;
  title: string;
}
