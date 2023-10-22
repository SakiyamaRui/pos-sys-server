
const orderSessionReset = (session) => {

    session.data.lastOrder.journalId = session.data.journalId;
    session.data.lastOrder.orderNumber = session.data.orderNumber;

    session.data.registItems = [];
    session.data.orderIdList = [];
    session.data.orderNumber = null;
    session.data.journalId = null;
    session.data.memberData = {};

    return true;
}

export default orderSessionReset;