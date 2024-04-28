const ENDPOINT = '';

export const sendRequest = async (path: string, urlSearchParameters: URLSearchParams | undefined, method: string, headers: any, body: string | null) => {
    const url = new URL(`${ENDPOINT}${path}`);
    if (urlSearchParameters) {
        url.search = urlSearchParameters.toString();
    }
    printRequest(url.href, method, headers, body);
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type' : 'application/json',
            ...headers,
        },
        body
    }).then(async (response) => {
        if (!response.ok) {
            const error = await response.json();
            return Promise.reject(error);
        } else {
            return response;
        }
    });
    return response.json();
}


const printRequest = (url: string, method: string, headers: any, body: string | null) => {
    console.log(`url: ${url}`);
    console.log(`method: ${method}`);
    console.log(`headers: ${JSON.stringify(headers)}`);
    console.log(`body: ${body}`);
}

export interface CaseStatus {
    status: string,
    details: string
}

export const getCaseStatus = async (receiptNumber: string): Promise<CaseStatus> => {
    try {
        return await sendRequest(`/CaseStatus/${receiptNumber}`, undefined, 'GET', null, null);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const statusUpdate = async (receiptNumber: string, email: string) => {
    try {
        const requestBody = {
            receiptNumber,
            email
        }
        return await sendRequest(`/StatusUpdate`, undefined, 'POST', null, JSON.stringify(requestBody));
    } catch (error) {
        console.error(error);
        throw error;
    }
}