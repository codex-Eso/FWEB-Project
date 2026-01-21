//to add a new audit log into the admin logs
export const addAdminLog = async (action, isbn, title, userId = null) => {
    let jsonObject = new Object();
    jsonObject.auditTime = (new Date()).toISOString();
    jsonObject.bookISBN = isbn
    jsonObject.bookName = title
    jsonObject.actionName = action;
    jsonObject.readLog = false;
    if (userId !== null) {
        jsonObject.userId = userId;
    }
    await fetch(`http://localhost:5000/adminLogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonObject)
    })
}