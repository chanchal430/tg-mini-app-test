import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Confetti from 'react-confetti'

import { RootState } from '@/store'
import { claimCheckIn } from '@/store/slice/checkInSlice'
import { getTodayKey } from '@/core/helper'

import { FolksTapper } from '@/components/Tapper'
import EnergyBar from '@/components/Home/EnergyBar'
import SnackBar from '@/components/common/SnackBar'
import BottomBar from '@/components/Bottombar'
import { tap } from "@/services/gameService";

import styles from '@/styles/Home.module.css'
import ReferralModal from '@/components/common/modal/ReferralModal'
import DailyRewardModal from '@/components/common/modal/DailyRewardModal'
import { doTap } from '@/store/slice/gameSlice'
import { useTheme } from '@/theme/ThemeContext'

export default function Home() {
  const dispatch = useDispatch();

  const { colors } = useTheme();

  // user info from Redux
  const user = useSelector((s: RootState) => s.auth.user)
  const [energy, setEnergy] = useState(500);
  const checkIn = useSelector((state: RootState) => state.checkIn);
  const [points, setPoints] = useState(user?.points || 0);
  const [referralOpen, setReferralOpen] = useState(true);

  // confetti + snack for check-in
  const [showConfetti, setShowConfetti] = useState(false)
  const [snack, setSnack] = useState({ open: false, msg: '' })

  // daily check-in modal logic (if you still need it)
  const [rewardOpen, setRewardOpen] = useState(false)

  useEffect(() => {
    const today = getTodayKey()
    if (localStorage.getItem('dailyCheckInDate') !== today) {
      setRewardOpen(true)
    }
  }, [])



  // Daily reset at midnight
  useEffect(() => {
    const msUntilMidnight =
      new Date().setHours(24, 0, 0, 0) - Date.now()
    const timer = setTimeout(() => setEnergy(500), msUntilMidnight)
    return () => clearTimeout(timer)
  }, [getTodayKey()]);


  const handleTap = async () => {
    if (energy <= 0) return;

    try {
      const { newBalance } = await dispatch(doTap(1) as any)
      setPoints(newBalance);
      setEnergy((e) => e - 1);
    } catch (err) {
      console.error("Tap API failed", err);
      setSnack({ open: true, msg: "Tap failed, try again!" });
    }
  };
  // Claim today's bonus reward (if you have one)
  const handleClaimDaily = async () => {
    try {
      const result = await dispatch(claimCheckIn() as any)
      setShowConfetti(true)
      setSnack({
        open: true,
        msg: `🎉 Day ${result.streak}! +${result.reward} points!`,
      })
      localStorage.setItem('dailyCheckInDate', getTodayKey())
    } catch {
      setSnack({ open: true, msg: 'Check-in failed, try later.' })
    } finally {
      setRewardOpen(false)
      setTimeout(() => setShowConfetti(false), 4000)
    }
  }

  return (
    <div className={styles.container}
    style={{ 
      backgroundColor: colors.base[100].DEFAULT,
      color: colors.base.content.DEFAULT
    }}
    >
      {/* Top bar */}
      <div className={styles.topBar}>
        <h2 className={styles.welcome} 
          style={{
            color: colors.base.content.DEFAULT
          }}
        >
          Welcome, {user?.username || 'Guest'}
        </h2>
        <button className={styles.aboutBtn} onClick={() => {/* open info modal */ }}>
          About Folks
        </button>
      </div>


      {/* Center tapper card */}
      <div className={styles.tapperCard}>
        <FolksTapper
          canIClickPlease={energy > 0}
          clickValue={1}
          handleClick={handleTap}
        />
        {/* <div className={styles.tapCounter}>
          Points this session: <strong>{points}</strong>
        </div> */}
      </div>

      {/* Energy bar */}
      <div className={styles.energyContainer}>
        <EnergyBar current={energy} max={500} />
        <div className={styles.energyLabel}>
          Energy remaining: {energy}/500 taps
        </div>
      </div>

      {/* Optional confetti + snack */}
      {showConfetti && <Confetti />}
      <SnackBar
        open={snack.open}
        message={snack.msg}
        onClose={() => setSnack({ open: false, msg: '' })}
        duration={3500}
      />

      {/* Bottom nav */}
      <BottomBar />

      {/* Daily-reward modal (if you still want it) */}
      {rewardOpen && (
        <div className={styles.dailyModalBackdrop}>

          <ReferralModal
            isOpen={referralOpen}
            onClose={() => setReferralOpen(false)}
            referralCode={''}
          />
          {/* Daily Reward Modal: Use real claim logic */}
          {showConfetti && <Confetti />}
          <DailyRewardModal
            isOpen={rewardOpen}
            onClose={() => setRewardOpen(false)}
            onClaim={handleClaimDaily}
            currentDay={checkIn.streak}
          />

          <SnackBar
            open={snack.open}
            message={snack.msg}
            onClose={() => setSnack({ open: false, msg: '' })}
            duration={3500}
          />
        </div>
      )}
    </div>
  )
}
