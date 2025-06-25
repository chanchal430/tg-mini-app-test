// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { loadTasks, markTaskComplete } from '@/store/slice/tasksSlice';
// import { AppDispatch, RootState } from '@/store';
// import GameCard from '@/components/common/GameCard';
// import Tick from '../public/Tick.svg';
// import BottomBar from '@/components/Bottombar';
// import styles from '@/styles/task.module.css';
// import SnackBar from '@/components/common/SnackBar';
// import { Title } from '@telegram-apps/telegram-ui';

// const TasksScreen = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { list: tasks, status } = useSelector((s: RootState) => s.tasks);
//   const [snack, setSnack] = React.useState<{ open: boolean; msg: string }>({ open: false, msg: '' });

//   useEffect(() => {
//     dispatch(loadTasks());
//   }, [dispatch]);

//   const handleStart = (taskId: number) => {
//     // record timestamp in localStorage or state, disable start → claim after 1h
//     const startedAt = Date.now();
//     localStorage.setItem(`task:${taskId}:startedAt`, String(startedAt));
//     // force re-render—you could store in local React state if you want
//     setSnack({ open: true, msg: 'Task started! Come back in 1 hour to claim.' });
//   };

//   const handleClaim = async (taskId: number) => {
//     const action = await dispatch(markTaskComplete({ taskId, proof: {} })) as any;
//     if (markTaskComplete.fulfilled.match(action)) {
//       setSnack({ open: true, msg: `You earned ${action.payload.reward} points!` });
//     } else {
//       setSnack({ open: true, msg: `Couldn’t claim: ${action.error.message}` });
//     }
//   };

//   const now = Date.now();
//   const renderCard = (task: any) => {
//     const startedAt = Number(localStorage.getItem(`task:${task.id}:startedAt`)) || 0;
//     const elapsed = now - startedAt;
//     const oneHour = 1000 * 60 * 60;
//     const completed = startedAt > 0 && elapsed >= oneHour;
//     // const loading = claiming[task.id] === 'loading';/

//     let btnText: React.ReactNode = 'Start';
//     let onClick = () => handleStart(task.id);
//   if (completed) {
//       btnText = 'Claim';
//       onClick = () => handleClaim(task.id);
//     } else if (startedAt > 0) {
//         btnText = 'Started';
//         onClick = () => {}; // Disable button
//     }

//     return (
//       <GameCard
//         key={task.id}
//         mainText={task.platform === 'promos' ? `Promote on ${task.type}` : task.url}
//         secondaryText={`+${task.reward} FP`}
//         className={styles.gameCard}
//         btnText={btnText}
//         userReward={false}
//         onClick={onClick}
//       />
//     );
//   };

//   return (
//     <>
//       <div className={styles.screen}>
//         <div className={styles.header}>
//           <Title level={'2'}>Tasks</Title>
//         </div>
//         {status === 'loading' && <div>Loading…</div>}
//         {status === 'succeeded' && (
//           <div className={styles.taskList}>
//             {tasks.map(renderCard)}
//           </div>
//         )}
//         {status === 'failed' && <div>Error loading tasks</div>}
//       </div>
//       <BottomBar />
//       <SnackBar
//         open={snack.open}
//         message={snack.msg}
//         onClose={() => setSnack({ open: false, msg: '' })}
//         duration={3000}
//       />
//     </>
//   );
// };

// export default TasksScreen;


// tasks.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadTasks, markTaskComplete } from '@/store/slice/tasksSlice';
import { AppDispatch, RootState } from '@/store';
import GameCard from '@/components/common/GameCard';
import BottomBar from '@/components/Bottombar';
import styles from '@/styles/task.module.css';
import SnackBar from '@/components/common/SnackBar';
import { Title } from '@telegram-apps/telegram-ui';

const TASK_TYPES = ['daily', 'weekly', 'monthly', 'promos'];

const TasksScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: tasks, status } = useSelector((s: RootState) => s.tasks);
  const [snack, setSnack] = useState<{ open: boolean; msg: string }>({ open: false, msg: '' });
  
  // 1. Add state to manage the active tab
  const [activeTab, setActiveTab] = useState('daily');

  // 2. Fetch tasks whenever the activeTab changes
  useEffect(() => {
    dispatch(loadTasks(activeTab));
  }, [dispatch, activeTab]);

  // 3. New handler to open link and start the task timer
  const handleGoToTask = (task: any) => {
    // Open the task URL in a new tab
    window.open(task.url, '_blank', 'noopener,noreferrer');
    
    // Mark the task as started in localStorage
    localStorage.setItem(`task:${task.id}:startedAt`, String(Date.now()));

    setSnack({ open: true, msg: 'Task started! Come back later to claim.' });
    // You might want a more subtle way to re-render than a full reload
    // For now, this is a simple way to update button state on return
  };

  const handleClaim = async (taskId: number) => {
    const action = await dispatch(markTaskComplete({ taskId, proof: {} })) as any;
    if (markTaskComplete.fulfilled.match(action)) {
      setSnack({ open: true, msg: `You earned ${action.payload.reward} points!` });
    } else {
      setSnack({ open: true, msg: `Couldn’t claim: ${action.error.message}` });
    }
  };

  const now = Date.now();

  const renderCard = (task: any) => {
    const startedAt = Number(localStorage.getItem(`task:${task.id}:startedAt`)) || 0;
    const elapsed = now - startedAt;
    // Example: 1 hour timer. You can make this dynamic based on the task later.
    const oneHour = 1000 * 60 * 60; 
    const isClaimable = startedAt > 0 && elapsed >= oneHour;

    let btnText: React.ReactNode = 'Go';
    let onClick = () => handleGoToTask(task);

    if (isClaimable) {
      btnText = 'Claim';
      onClick = () => handleClaim(task.id);
    } else if (startedAt > 0) {
      btnText = 'Pending';
      onClick = () => {}; // Disable button while pending
    }

    return (
      <GameCard
        key={task.id}
        // 4. Use the new description for the main text
        mainText={task.description}
        secondaryText={`+${task.reward} FP`}
        className={styles.gameCard}
        btnText={btnText}
        userReward={false}
        onClick={onClick}
      />
    );
  };

  return (
    <>
      <div className={styles.screen}>
        <div className={styles.header}>
          <Title level={'2'}>Tasks</Title>
        </div>

        {/* 5. Add the Tab UI */}
        <div className={styles.tabs}>
          {TASK_TYPES.map((type) => (
            <button
              key={type}
              className={`${styles.tab} ${activeTab === type ? styles.active : ''}`}
              onClick={() => setActiveTab(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {status === 'loading' && <div>Loading tasks…</div>}
        {status === 'succeeded' && (
          <div className={styles.taskList}>
            {tasks.length > 0 ? (
                tasks.map(renderCard)
            ) : (
                <div>No tasks available for this category.</div>
            )}
          </div>
        )}
        {status === 'failed' && <div>Error loading tasks. Please try again.</div>}
      </div>
      <BottomBar />
      <SnackBar
        open={snack.open}
        message={snack.msg}
        onClose={() => setSnack({ open: false, msg: '' })}
        duration={3000}
      />
    </>
  );
};

export default TasksScreen;