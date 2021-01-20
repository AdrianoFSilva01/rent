<template>
    <div class="bg-white text-sm">
        <div class="w-full flex items-center justify-between">
            <button class="arrow-button" @click.stop="currentDate.previousMonth" :disabled="previousButton">
                <div class="relative w-3">
                    <hr class="absolute border-black w-2 transform rotate-45 origin-bottom-left" />
                    <hr class="absolute border-black w-3" />
                    <hr class="absolute border-black w-2 transform -rotate-45 origin-top-left" />
                </div>
            </button>
            <div class="space-x-1">
                <span>
                    {{ currentDate.MonthName }}
                </span>
                <span>
                    {{ currentDate.Year }}
                </span>
            </div>
            <button class="arrow-button" @click.stop="currentDate.nextMonth">
                <div class="relative w-3 transform rotate-180">
                    <hr class="absolute border-black w-2 transform rotate-45 origin-bottom-left" />
                    <hr class="absolute border-black w-3" />
                    <hr class="absolute border-black w-2 transform -rotate-45 origin-top-left" />
                </div>
            </button>
        </div>
        <div class="grid grid-cols-7 bg-gray-100 py-2 border-t border-b border-gray-200">
            <template v-for="(weekDay, index) in WeekDays" :key="index">
                <span class="h-full w-full text-center">
                    {{ weekDay }}
                </span>
            </template>
        </div>
        <div class="day-grid">
            <template v-for="(day, index) in currentDate.fullMonthWeeks" :key="index">
                <template v-if="startDate && day < startDate">
                    <span />
                </template>
                <template v-else>
                    <span :class="[selectedDay && day.equals(selectedDay) ? 'selected-day' : '',
                                   day.Month != currentDate.Month ? 'other-month-days' : '']"
                          class="days" @click="onSelectedDay(day)"
                    >
                        {{ day.Day }}
                    </span>
                </template>
            </template>
        </div>
    </div>
</template>

<script lang="ts" src="./DatePicker.ts" />

<style scoped lang="postcss" src="./DatePicker.pcss" />