## Super simple app to send test messages to Eventhub

I have run across scenarios where i had to quickly do some POC for event processing for event hub events. e.g. Databricks/HDI Spark structured streaming, ADX connection to eventhub etc.  I wrote a small piece of code to send messages but i used it a few times so thought would share if someone wants.

### Config changes

1. Please change .env file so event hub connection string can be set correctly.
2. (Optional) Change ./config/default.json file messagebody, waitintervalinms and messagespertriger to suit your needs.

#### Run it locally in machine

You can run following command to send messages to event hub.

```
node sendmessages.js
```

### Use Azure containers to send messages

Replace the variables as needed. I have left some variables from my test as is intentionally.

Create container registry:
``` 
az acr create -n <Your registry name> -g <resource group> --sku Standard
```

Build and upload image to ACR:

```
az acr build . -r <Your registry name> -t sendmessageapp/toeventhub
```

By now you should see the ACR in azure portal with the image in there. Next command will set the username and password which will be used in next step to create a container. There potentially are other ways to get around this step but for quick testing/temp purposes this works well. 


```
az acr update --name <Registry name> --admin-enabled true 
```

Get the credentials using below command.

```
 az acr credential show --name <Registry name> -g <resource group>
 ```

 Use the below command to run a container with 1 cpu and 0.5 gb memory. Change as appropriate to your environment.

 ```


az container create --name myapp -g <resource group> --image "<registry name>.azurecr.io/sendmessageapp/toeventhub:latest" --cpu 1 --memory 0.5 --registry-username <username> --registry-password <password> --registry-login-server <loginserver>.azurecr.io

```


If everything works well, your eventhub should be getting messages from container. You can see that in container log as well as event hub. You can easily add more nodes or change config of existing container to add more messages as well.





