<template>
    <div class="bg-white text-sm">
        <div class="w-full flex items-center justify-between">
            <button class="arrow-button" @click.stop="previousMonth" :disabled="disablePreviousButton">
                <div class="relative w-3">
                    <hr class="absolute border-black w-2 transform rotate-45 origin-bottom-left" />
                    <hr class="absolute border-black w-3" />
                    <hr class="absolute border-black w-2 transform -rotate-45 origin-top-left" />
                </div>
            </button>
            <div class="space-x-1">
                <span>
                    {{ months[currentDate.getMonth()] }}
                </span>
                <span>
                    {{ currentDate.getFullYear() }}
                </span>
            </div>
            <button class="arrow-button" @click.stop="nextMonth">
                <div class="relative w-3 transform rotate-180">
                    <hr class="absolute border-black w-2 transform rotate-45 origin-bottom-left" />
                    <hr class="absolute border-black w-3" />
                    <hr class="absolute border-black w-2 transform -rotate-45 origin-top-left" />
                </div>
            </button>
        </div>
        <div class="grid grid-cols-7 bg-gray-100 py-2 border-t border-b border-gray-200">
            <template v-for="(weekDay, index) in weekDays" :key="index">
                <span class="h-full w-full text-center">
                    {{ weekDay }}
                </span>
            </template>
        </div>
        <div class="day-grid">
            <template v-for="(day, index) in datesToDisplay" :key="index">
                <template v-if="startDate && day < new Date(startDate.toDateString())">
                    <span class="not-allowed-days" />
                </template>
                <template v-else>
                    <span :class="[selectedDay && day.toDateString() === selectedDay.toDateString() ? 'selected-day' : '',
                                   day.getMonth() != currentDate.getMonth() ? 'next-month-days' : '']"
                          class="days" @click="onSelectedDay(day)"
                    >
                        {{ day.getDate() }}
                    </span>
                </template>
            </template>
        </div>
    </div>
</template>

<script lang="ts" src="./DatePicker.ts" />

<style scoped lang="postcss" src="./DatePicker.pcss" />