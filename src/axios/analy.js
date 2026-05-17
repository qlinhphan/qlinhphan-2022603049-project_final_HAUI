// http://0.0.0.0:8000/segment-tumor/
import axios from "axios";

const analysistImg = async (file) => {
    const form = new FormData()
    form.append("file", file)
    const rs = await axios.post("http://localhost:8000/segment-tumor/", form)
    return rs
}

const chatWithMedicalRag = async (payload) => {
    const rs = await axios.post("http://localhost:8002/chat", payload)
    return rs
}

const apiSaveInforPatientFull = async (accessToken, name, address, age, phone, gender, area, description, nameType) => {
    const data = new FormData()
    data.append('name', name)
    data.append('address', address)
    data.append('age', age)
    data.append('phone', phone)
    data.append('gender', gender)
    data.append('area', area)
    data.append('description', description)
    data.append('nameType', nameType)
    const rs = await axios.post("http://localhost:8081/patient-create", data,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    return rs
}

const apiSaveInforPatientNotFull = async (accessToken, phone, area, description, nameType) => {
    const data = new FormData()
    // data.append('name', name)
    // data.append('address', address)
    // data.append('age', age)
    data.append('phone', phone)
    // data.append('gender', gender)
    data.append('area', area)
    data.append('description', description)
    data.append('nameType', nameType)
    const rs = await axios.post("http://localhost:8081/patient-create", data,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    return rs
}


const apiGetDetail = async (accessToken) => {
    const rs = await axios.get('http://localhost:8081/get-detail',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    return rs;
}


const apiAdminViewPatient = async (accessToken, pageNum, pageSize) => {
    const rs = await axios.get(`http://localhost:8081/admin-manage-patient?pageNum=${pageNum}&pageSize=${pageSize}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    return rs;
}

export { analysistImg, chatWithMedicalRag, apiSaveInforPatientFull, apiSaveInforPatientNotFull, apiGetDetail, apiAdminViewPatient }
