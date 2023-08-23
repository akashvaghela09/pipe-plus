import EncryptedStorage from 'react-native-encrypted-storage';

export const addInitialValues = async () => {
  let subscriptions = await EncryptedStorage.getItem("subscriptions");
  if (subscriptions === null) {
    console.log("Subscriptions not found");
    let emptySubscriptions = [];
    await EncryptedStorage.setItem('subscriptions', JSON.stringify(emptySubscriptions));
  }

  let subscriptionsCount = await EncryptedStorage.getItem("subscriptions_count");
  if (subscriptionsCount === null) {
    console.log("Subscriptions count not found");
    await EncryptedStorage.setItem('subscriptions_count', JSON.stringify(0));
  }
};