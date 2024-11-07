const priceReplaceHandler = (price: number) => {
    const n = price.toString();
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + " ");
}

export default priceReplaceHandler;