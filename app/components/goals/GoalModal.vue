<template>
  <Modal v-model="isOpen" :title="isEditing ? t('goals.editGoal') : t('goals.addGoal')">
    <div class="space-y-4">
      <Input
        v-model="formData.title"
        :label="t('goals.goalTitle')"
        :placeholder="t('goals.goalTitle')"
        icon="i-carbon-target"
      />
      
      <div class="space-y-1">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {{ t('goals.description') }}
        </label>
        <textarea
          v-model="formData.description"
          :placeholder="t('goals.description')"
          rows="2"
          class="input resize-none"
        />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {{ t('goals.goalType') }}
          </label>
          <select v-model="formData.type" class="input">
            <option value="task-driven">{{ t('goals.taskDriven') }}</option>
            <option value="time-driven">{{ t('goals.timeDriven') }}</option>
          </select>
        </div>
        
        <Input
          v-model="formData.deadline"
          :label="t('goals.deadline')"
          type="date"
        />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <Input
          v-model.number="formData.target"
          :label="t('goals.target')"
          type="number"
          placeholder="10"
        />
        
        <Input
          v-model="formData.unit"
          :label="t('goals.unit')"
          placeholder="任务数 / 番茄 / 小时"
        />
      </div>
      
      <div v-if="isEditing">
        <Input
          v-model.number="formData.current"
          :label="t('goals.current')"
          type="number"
        />
      </div>
    </div>
    
    <template #footer>
      <Button v-if="isEditing" variant="danger" @click="deleteGoal" class="mr-auto">
        {{ t('common.delete') }}
      </Button>
      <Button variant="ghost" @click="close">
        {{ t('common.cancel') }}
      </Button>
      <Button @click="save" :disabled="!formData.title.trim()">
        {{ t('common.save') }}
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/Modal.vue'
import Input from '~/components/ui/Input.vue'
import Button from '~/components/ui/Button.vue'
import type { Goal } from '~/stores/goals'

interface Props {
  modelValue: boolean
  editGoal?: Goal | null
}

const props = withDefaults(defineProps<Props>(), {
  editGoal: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const { t } = useI18n()
const goalsStore = useGoalsStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEditing = computed(() => !!props.editGoal)

const defaultFormData = () => ({
  title: '',
  description: '',
  deadline: '',
  type: 'task-driven' as 'task-driven' | 'time-driven',
  target: 10,
  current: 0,
  unit: '任务',
})

const formData = reactive(defaultFormData())

watch(() => props.modelValue, (val) => {
  if (val) {
    if (props.editGoal) {
      Object.assign(formData, {
        title: props.editGoal.title,
        description: props.editGoal.description,
        deadline: props.editGoal.deadline || '',
        type: props.editGoal.type,
        target: props.editGoal.target,
        current: props.editGoal.current,
        unit: props.editGoal.unit,
      })
    } else {
      Object.assign(formData, defaultFormData())
    }
  }
})

const save = () => {
  if (!formData.title.trim()) return
  
  const goalData = {
    title: formData.title.trim(),
    description: formData.description,
    deadline: formData.deadline || null,
    type: formData.type,
    target: formData.target || 1,
    unit: formData.unit || '任务',
  }
  
  if (isEditing.value && props.editGoal) {
    goalsStore.updateGoal(props.editGoal.id, {
      ...goalData,
      current: formData.current,
    })
  } else {
    goalsStore.addGoal(goalData)
  }
  
  emit('saved')
  close()
}

const deleteGoal = () => {
  if (props.editGoal && confirm(t('common.confirm') + '?')) {
    goalsStore.deleteGoal(props.editGoal.id)
    close()
  }
}

const close = () => {
  isOpen.value = false
}
</script>
