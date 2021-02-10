<template>
    <div class="space-y-10">
        <div class="relative flex items-center h-180 w-full">
            <Carousel ref="carousel" :images="images" />
            <Arrow class="absolute -left-5" @click="prevImage" />
            <Arrow class="absolute -right-5" :direction="ArrowDirection.right" @click="nextImage" />
        </div>
        <div class="relative flex w-full h-40 justify-center">
            <div class="absolute flex -top-20 w-4/5 h-full bg-gray-300 items-center space-x-10 px-10">
                <div class="dropdown-container">
                    <div class="subtitle">
                        When
                    </div>
                    <div class="dropdown">
                        <Dropdown dropdown-text="From" v-model="selectedDay" @open-component="reset">
                            <svg class="w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <template #component>
                                <DatePicker ref="datePicker" v-model="selectedDay" :start-date="startDate" name="From" />
                            </template>
                        </Dropdown>
                    </div>
                </div>
                <div class="dropdown-container">
                    <div class="subtitle">
                        How Long
                    </div>
                    <div class="dropdown">
                        <Dropdown dropdown-text="Until" v-model="selectedDayUntil" @open-component="resetUntil">
                            <svg class="w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <template v-if="selectedDay" #component>
                                <DatePicker ref="datePickerUntil" v-model="selectedDayUntil" :start-date="startDateUntil" name="Until" />
                            </template>
                        </Dropdown>
                    </div>
                </div>
                <div class="dropdown-container">
                    <div class="subtitle">
                        How Many People
                    </div>
                    <div class="dropdown">
                        <Dropdown dropdown-text="Number Of Guests" v-model="selectedPersons" :source="persons" class="bg-gray-200 border-box border hover:border-gold hover:text-gold pl-2 py-0.5 cursor-pointer">
                            <svg class="w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </Dropdown>
                    </div>
                </div>
                <div>
                    <WaveButton buttontext="CHECK" />
                </div>
            </div>
        </div>
        <div class="flex">
            <TextSlider @selected-text-slider="onSelectedTextSlider" class="flex items-center text-3xl" :texts="Object.keys(sliders)" />
            <div class="flex flex-grow justify-end">
                <Arrow @click="previousSlider" :disable-button="disablePreviousSliderButton" />
                <Arrow @click="nextSlider" :disable-button="disableNextSliderButton" :direction="ArrowDirection.right" />
            </div>
        </div>

        <div class="flex">
            <Slider class="h-172 w-full" ref="slider" v-model:next-button="disableNextSliderButton" v-model:previous-button="disablePreviousSliderButton">
                <template v-for="(typeRoom, index) in sliders" :key="index">
                    <template v-for="(room, i) in typeRoom" :key="i">
                        <div v-mouse-follower="'round-mouse-follower'" ref="roomSlider" :id="i === 0 ? index : ''" class="relative w-124 h-full last:mr-0 mr-5 text-white">
                            <img :src="room[0]" class="absolute w-full h-full object-cover" />
                            <div class="overlay">
                                <div class="flex flex-col relative justify-end p-10 w-full h-full">
                                    <span class="text-2xl w-full">
                                        {{ room[1] }}
                                    </span>
                                    <div class="flex">
                                        <span class="flex flex-grow">
                                            {{ room[2] }}
                                        </span>
                                        <span>
                                            {{ room[3] }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
            </Slider>
        </div>
    </div>
</template>

<script lang="ts" src="./MainView.ts" />

<style scoped lang="postcss" src="./MainView.pcss" />
