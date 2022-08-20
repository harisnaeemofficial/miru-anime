import { ipcRenderer } from "electron";
export async function sendEventAsync(channelId, ...data){
    let response = await ipcRenderer.invoke(channelId, ...data);
    if (response.error) throw new Error(response.error)
    return response.data;
}