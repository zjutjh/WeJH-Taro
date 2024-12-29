export interface BorrowBooksInfo {
  barcode: string;//书的条形码
  loanDate: string;
  loanId: string;//该次借阅的id(每次借阅都会生成一个id)
  locationName: string;
  normReturnDate: string;//规定归还时间
  returnDate: string;//实际归还时间
  title: string;
}
