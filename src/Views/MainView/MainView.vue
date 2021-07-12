<template>
    <div class="space-y-10">
        <div class="fade-animation relative flex items-center h-180 w-full">
            <Slider class="transition-all duration-700" ref="slider" :images="images" :draggable="false" @disable-arrow="disableSliderArrow" @enable-arrow="enableSliderArrow" />
            <Arrow class="absolute -left-5" :disable-button="disablePreviousSliderButton" @click="prevImage" />
            <Arrow class="absolute -right-5" :disable-button="disableNextSliderButton" :direction="ArrowDirection.right" @click="nextImage" />
        </div>
        <div class="fade-animation relative flex w-full h-40 justify-center opacity-0 z-10" style="animation-delay: 0.5s">
            <div class="absolute flex -top-28 w-4/5 h-full bg-white border-4 border-gold items-center space-x-10 px-10">
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
        <div class="flex" v-in-viewport="'fade-animation'">
            <TextCarousel ref="textCarousel" @selected-text-carousel="onSelectedTextCarousel" class="flex items-center text-3xl" :texts="Object.keys(carouselItems)" />
            <div class="flex flex-grow justify-end">
                <Arrow @click="previousCarouselItem" :disable-button="disablePreviousCarouselButton" />
                <Arrow @click="nextCarouselItem" :disable-button="disableNextCarouselButton" :direction="ArrowDirection.right" />
            </div>
        </div>
        <div class="flex" v-in-viewport="'overflow-visible'">
            <Carousel class="h-172 w-full duration-700"
                      ref="carousel"
                      v-model="carouselIndex"
                      v-model:next-button="disableNextCarouselButton"
                      v-model:previous-button="disablePreviousCarouselButton"
                      :click-to-move="false"
                      @disable-arrow="disableArrow"
                      @enable-arrow="enableArrow"
            >
                <template v-for="(typeRoom, index) in carouselItems" :key="index">
                    <template v-for="(room, i) in typeRoom" :key="i">
                        <div ref="carouselItem"
                             :id="i === 0 ? index : ''"
                             v-in-viewport="'fade-animation'"
                             v-mouse-follower="'round-mouse-follower'"
                             class="relative w-124 h-full last:mr-0 mr-5 text-white opacity-0"
                             :style="'animation-delay:' + 0.1 * typeRoom.position + 's'"
                        >
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
            </Carousel>
        </div>
        <div class="flex justify-center space-x-40 pt-20" v-in-viewport="'fade-animation'">
            <div class="space-y-10">
                <img class="h-136 w-140 object-cover" src="https://media.tacdn.com/media/attractions-splice-spp-674x446/07/ab/f3/fd.jpg" />
                <img class="h-136 w-140 object-cover" src="https://globalgrasshopper.com/wp-content/uploads/2014/01/Top-10-places-to-visit-in-Madeira.jpg" />
            </div>
            <div class="w-84 sticky top-0 self-start py-12 space-y-10">
                <p class="text-5xl">
                    What stays, is what counts.
                </p>
                <p class="text-sm opacity-60">
                    A holiday in Madeira can be many things.
                    Full of adventure, full of excitement and adrenaline.
                    Or soothing, calming and relaxing.
                    In any case, it’s something that always stays in your memory.
                </p>
                <p class="text-sm opacity-60">
                    Our rooms and studios located in the centre of Funchal are the ideal base from which to explore the region in all its variety,
                    to spend quality time with friends and family, to be active, or to just do things for which you otherwise never have the time.
                    Like nothing, for example.
                </p>
                <p class="text-sm opacity-60">
                    Welcome to Madeira.
                    <br />
                    Rooms/Studios
                    <br />
                    in Funchal
                </p>
                <div class="text-with-arrow">
                    <div class="transform rotate-180 relative w-5">
                        <hr class="w-0 transform rotate-45 origin-bottom-left" />
                        <hr class="w-full" />
                        <hr class="w-0 transform -rotate-45 origin-top-left" />
                    </div>
                    <p class="text-sm">
                        Our Island
                    </p>
                </div>
            </div>
        </div>
        <div class="pt-20 w-136 text-center mx-auto space-y-10" v-in-viewport="'fade-animation'">
            <p class="text-4xl">
                Whatever you like.
            </p>
            <p>
                Want to spend the whole day indoors without feeling guilty?
                <br />
                Here, that’s no problem. But neither is going out. It’s just up to you.
            </p>
        </div>
        <div class="relative flex items-center h-180 w-full" ref="activitySliderContainer">
            <Slider ref="activitySlider"
                    class="transition-all duration-700"
                    @changed-slider-image="changedActivitySliderImage"
                    @activity-slider-mouse-down="activitySliderMouseDown"
                    @activity-slider-mouse-moving="activitySliderMouseMoving"
                    @add-interval="startIntervalBarTransition"
                    @interval-loaded="intervalBarLoadedTransition"
                    @stop-interval="intervalBarStopTransition"
                    :selected-index="activitiesCarouselIndex"
                    :images="activitiesImages"
                    :draggable="true"
                    :unable-to-change-opacity="unableToChangeSliderOpacity"
            />
            <div class="interval-bar" ref="intervalBar" />
        </div>
        <div class="flex overflow-hidden" v-in-viewport="'overflow-visible'">
            <Arrow @click="previousActivityCarouselItem" :disable-button="disablePreviousActivityCarouselButton" />
            <Carousel ref="activityCarousel"
                      id="activityCarousel"
                      class="w-full duration-700 overflow-hidden"
                      @stop-slider-interval="stopSliderInterval"
                      @add-slider-interval="addSliderInterval"
                      @selected-changed="selectedChanged"
                      @activity-carousel-mouse-moving="activityCarouselMouseMoving"
                      @activity-carousel-mouse-up="activityCarouselMouseUp"
                      @disable-arrow="disableActivityArrow"
                      @enable-arrow="enableActivityArrow"
                      v-model="activitiesCarouselIndex"
                      :selected-position="1"
                      :click-to-move="true"
                      v-model:being-dragged="activityCarouselBeingDragged"
                      v-model:is-carousel-extreme="unableToChangeSliderOpacity"
            >
                <template v-for="(activity, index) in activities" :key="index">
                    <div ref="activityCarouselItem" class="w-60 flex items-center justify-center border-gold" :class="{'border-l': index !== 0, 'font-bold': activitiesCarouselIndex === index}">
                        {{ activity[0] }}
                    </div>
                </template>
            </Carousel>
            <Arrow @click="nextActivityCarouselItem" :disable-button="disableNextActivityCarouselButton" :direction="ArrowDirection.right" />
        </div>
        <div class="pt-20 flex flex-col items-center text-center space-y-10" v-in-viewport="'fade-animation'">
            <div class="text-sm">
                Our philosophy
            </div>
            <div class="w-3/5 text-3xl">
                A feeling, a scent, a moment. A laugh, an mmm…, a yes. Arrive, breathe in, breathe
                out, sleep through the night. Family, love, time and more time. Breakfast in bed,
                breakfast at twelve, breakfast for two. An excursion, a sunny day, a Sunday on a
                Monday. What stays? Everything stays. If you stay here.
            </div>
            <div class="text-with-arrow">
                <div class="transform rotate-180 relative w-5">
                    <hr class="w-0 transform rotate-45 origin-bottom-left" />
                    <hr class="w-full" />
                    <hr class="w-0 transform -rotate-45 origin-top-left" />
                </div>
                <p class="text-sm">
                    Our Island
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./MainView.ts" />

<style scoped lang="postcss" src="./MainView.pcss" />
