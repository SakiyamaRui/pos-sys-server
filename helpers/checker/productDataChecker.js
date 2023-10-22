

const productIdCheck = (product_id) => {
    if (product_id == null) {
        return true;
    }

    if (typeof product_id != "string") {
        return false;
    }

    if (product_id.length > 30) {
        return false;
    }else {
        return true;
    }
}

const productNameCheck = (product_name) => {

    if (typeof product_name != "string") {
        return false;
    }

    if (product_name.length > 100) {
        return false;
    }else {
        return true;
    }
}

const productPriceCheck = (price) => {

    if (typeof price != "number") {
        return false;
    }


    if (price > 999999998 || price < -999999998) {
        return false;
    }else {
        return true;
    }
}

const makerIdSyntaxCheck = (maker_id) => {

    if (maker_id === null) {
        return true;
    }

    if (typeof maker_id != "string") {
        return false;
    }

    if (maker_id.length > 30) {
        return false;
    }else {
        return true;
    }
}

export {
    productNameCheck,
    productPriceCheck,
    makerIdSyntaxCheck,
    productIdCheck,
}