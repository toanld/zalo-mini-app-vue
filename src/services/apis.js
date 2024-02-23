import api from 'zmp-sdk'

export const getPhoneNumber = () => new Promise(resolve => {
    api.getPhoneNumber({
        success: (data) => {
            console.log(data);
            let phone_number = data.number.replace(/ /g,'');
            phone_number = phone_number.replace("(+84)", "0");
            console.log(phone_number);
            resolve(phone_number)
        },
        fail: (error) => {
            console.error(error)
        }
    })
})

export const openWebURL = () => {
    api.openWebview({
        url: "https://sosanhnha.com/",
        config: {
            style: "normal",
            leftButton: "back"
        },
        success: (res) => {
            // xử lý khi gọi api thành công
        },
        fail: (error) => {
            // xử lý khi gọi api thất bại
            console.log(error);
        }
    });
}
