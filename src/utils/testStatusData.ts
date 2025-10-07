import { StatusManager } from './statusUtils';
import { CreateStatusData } from '../types/status.types';

export const createSampleStatuses = async (): Promise<void> => {
  try {
    // 1. CREATE TEXT STATUS
    const textStatusData: CreateStatusData = {
      type: 'text',
      text: 'Having a great day! 🌟',
      backgroundColor: '#FF5722',
      textColor: '#FFFFFF',
      privacy: 'contacts',
    };

    const textStatusId = await StatusManager.createStatus(textStatusData);
    console.log('✅ Text status created:', textStatusId);

    // 2. CREATE ANOTHER TEXT STATUS
    const textStatusData2: CreateStatusData = {
      type: 'text',
      text: 'Working on my React Native app 💻',
      backgroundColor: '#4CAF50',
      textColor: '#FFFFFF',
      privacy: 'all',
    };

    const textStatusId2 = await StatusManager.createStatus(textStatusData2);
    console.log('✅ Text status 2 created:', textStatusId2);

    console.log('🎉 Sample statuses created successfully!');
  } catch (error) {
    console.error('❌ Error creating sample statuses:', error);
    throw error;
  }
};

export const testStatusViewing = async (
  statusId: string,
  ownerId: string,
): Promise<void> => {
  try {
    await StatusManager.viewStatus(statusId, ownerId);
    console.log('✅ Status viewing test completed');
  } catch (error) {
    console.error('❌ Error testing status viewing:', error);
    throw error;
  }
};
