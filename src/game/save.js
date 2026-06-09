import pako from 'pako'
import { gameState, getSaveState, loadSaveState, addNotification, D0, DEC } from './engine.js'

// 序列化游戏状态为字符串
export function serializeState(state) {
  const jsonStr = JSON.stringify(state)
  const compressed = pako.deflate(jsonStr)
  // 转为base64
  return btoa(String.fromCharCode(...new Uint8Array(compressed)))
}

// 反序列化
export function deserializeState(base64Str) {
  try {
    const binary = atob(base64Str)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const decompressed = pako.inflate(bytes, { to: 'string' })
    return JSON.parse(decompressed)
  } catch (e) {
    console.error('反序列化失败:', e)
    return null
  }
}

// 保存到localStorage
export function saveToLocal() {
  try {
    const state = getSaveState()
    const serialized = serializeState(state)
    localStorage.setItem('nrgci_save', serialized)
    gameState.lastSaveTime = Date.now()
    addNotification('游戏已保存！')
    return true
  } catch (e) {
    console.error('保存失败:', e)
    addNotification('保存失败！')
    return false
  }
}

// 从localStorage加载
export function loadFromLocal() {
  try {
    const serialized = localStorage.getItem('nrgci_save')
    if (!serialized) {
      addNotification('没有找到存档！')
      return false
    }
    const state = deserializeState(serialized)
    if (!state) {
      addNotification('存档损坏！')
      return false
    }
    return loadSaveState(state)
  } catch (e) {
    console.error('加载失败:', e)
    addNotification('加载存档失败！')
    return false
  }
}

// 检查是否有自动存档
export function hasSave() {
  return localStorage.getItem('nrgci_save') !== null
}

// 导出到剪贴板
export async function exportToClipboard() {
  try {
    const state = getSaveState()
    const serialized = serializeState(state)
    await navigator.clipboard.writeText(serialized)
    addNotification('存档已复制到剪贴板！')
    return true
  } catch (e) {
    console.error('导出到剪贴板失败:', e)
    addNotification('导出失败！')
    return false
  }
}

// 从剪贴板导入
export async function importFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    if (!text) {
      addNotification('剪贴板为空！')
      return false
    }
    const state = deserializeState(text)
    if (!state) {
      addNotification('无效的存档数据！')
      return false
    }
    return loadSaveState(state)
  } catch (e) {
    console.error('从剪贴板导入失败:', e)
    addNotification('导入失败！')
    return false
  }
}

// 导出到文件
export function exportToFile() {
  try {
    const state = getSaveState()
    const serialized = serializeState(state)
    const blob = new Blob([serialized], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const date = new Date()
    const timestamp = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}_${String(date.getHours()).padStart(2,'0')}-${String(date.getMinutes()).padStart(2,'0')}-${String(date.getSeconds()).padStart(2,'0')}`
    a.download = `NRGCI_save_${timestamp}.txt`
    a.click()
    URL.revokeObjectURL(url)
    addNotification('存档已导出到文件！')
    return true
  } catch (e) {
    console.error('导出到文件失败:', e)
    addNotification('导出到文件失败！')
    return false
  }
}

// 从文件导入
export function importFromFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) {
        resolve(false)
        return
      }
      try {
        const text = await file.text()
        const state = deserializeState(text)
        if (!state) {
          addNotification('无效的存档文件！')
          resolve(false)
          return
        }
        const result = loadSaveState(state)
        resolve(result)
      } catch (err) {
        console.error('从文件导入失败:', err)
        addNotification('从文件导入失败！')
        resolve(false)
      }
    }
    input.click()
  })
}

// 自动保存定时器
let autoSaveInterval = null
export function startAutoSave(intervalMs = 30000) {
  stopAutoSave()
  autoSaveInterval = setInterval(() => {
    saveToLocal()
  }, intervalMs)
}

export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
  }
}