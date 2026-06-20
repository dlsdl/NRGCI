<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal save-modal">
      <h3>💾 存档管理</h3>
      <div class="save-actions">
        <button class="save-btn" @click="doSave">💾 手动保存</button>
        <button class="save-btn" @click="exportClip">📋 导出到剪贴板</button>
        <button class="save-btn" @click="importClip">📥 从剪贴板导入</button>
        <button class="save-btn" @click="exportFile">📄 导出到文件</button>
        <button class="save-btn" @click="importFile">📁 从文件导入</button>
        <button class="save-btn danger-btn" @click="doHardReset">⚠️ 硬重置</button>
        不真实割草增量(NRGCI) 作者：dlsdl<br />
        提示：按住shift一次购买10级升级
      </div>
      <div class="save-status" v-if="statusMsg">{{ statusMsg }}</div>
      <button class="modal-close-btn" @click="$emit('close')">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { gameState, hardReset } from '../game/engine.js'
import {
  saveToLocal, loadFromLocal,
  exportToClipboard, importFromClipboard,
  exportToFile, importFromFile,
} from '../game/save.js'

const emit = defineEmits(['close'])
const statusMsg = ref('')

function doSave() { saveToLocal(); statusMsg.value = '已保存'; setTimeout(() => statusMsg.value = '', 2000) }
function doLoad() {
  if (loadFromLocal()) { statusMsg.value = '已加载'; emit('close') }
  else statusMsg.value = '无存档或加载失败'
  setTimeout(() => statusMsg.value = '', 2000)
}
async function exportClip() {
  await exportToClipboard()
  statusMsg.value = '已复制到剪贴板'; setTimeout(() => statusMsg.value = '', 2000)
}
async function importClip() {
  const r = await importFromClipboard()
  if (r) { statusMsg.value = '已导入'; emit('close') }
  else statusMsg.value = '导入失败'
  setTimeout(() => statusMsg.value = '', 2000)
}
function exportFile() { exportToFile(); statusMsg.value = '已导出'; setTimeout(() => statusMsg.value = '', 2000) }
async function importFile() {
  const r = await importFromFile()
  if (r) { statusMsg.value = '已导入'; emit('close') }
  else statusMsg.value = '导入失败'
  setTimeout(() => statusMsg.value = '', 2000)
}
function doHardReset() {
  if (confirm('确定硬重置？所有进度将永久丢失！')) {
    hardReset()
    statusMsg.value = '已硬重置'
    setTimeout(() => { statusMsg.value = ''; emit('close') }, 1000)
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #161b22;
  border: 2px solid #58a6ff;
  border-radius: 12px;
  padding: 20px;
  min-width: 320px;
}
.modal h3 { font-size: 18px; color: #58a6ff; margin-bottom: 12px; }
.save-actions { display: flex; flex-direction: column; gap: 6px; }
.save-btn {
  padding: 10px 16px;
  border: 1px solid #30363d;
  border-radius: 8px;
  background: #21262d;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  transition: all 0.15s;
}
.save-btn:hover { background: #30363d; border-color: #58a6ff; }
.danger-btn { color: #f85149; border-color: #f8514944; }
.danger-btn:hover { border-color: #f85149; background: #f8514911; }
.save-status { text-align: center; color: #3fb950; margin-top: 8px; font-size: 13px; min-height: 20px; }

.modal-close-btn {
  margin-top: 12px;
  width: 100%;
  padding: 8px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background: #21262d;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 14px;
}
.modal-close-btn:hover { background: #30363d; }
</style>