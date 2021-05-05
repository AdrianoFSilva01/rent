<template>
    <div class="space-y-32">
        <div class="fade-animation big-picture">
            <img class="object-cover h-full w-full" src="https://q4g9y5a8.rocketcdn.me/wp-content/uploads/2020/02/home-banner-2020-02-min.jpg" />
            <div class="flex flex-col absolute text-white space-y-4 items-center">
                <p class="text-5xl text-center">
                    A place to stay
                </p>
                <p class="w-96 text-center">
                    Apartments for two, for two plus one, for the family and for all families.
                    For friends, for groups and for groups of friends, and for everybody who wants to spend a carefree holiday in Madeira.
                </p>
                <a href="#Deluxe Appartement">
                    <div class="flex items-center w-5 h-5 cursor-pointer">
                        <div class="transform -rotate-90 relative w-5">
                            <hr class="w-2 absolute transform rotate-45 origin-bottom-left" />
                            <hr class="w-full absolute" />
                            <hr class="w-2 absolute transform -rotate-45 origin-top-left" />
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div class="flex justify-center space-x-28">
            <div v-in-viewport="'fade-animation'" class="sticky top-0 self-start space-y-4">
                <template v-for="(house, index) in houses" :key="index">
                    <div>
                        <a :href="'#' + house[1]">
                            <div class="relative flex items-center hover:opacity-100 cursor-pointer" :class="selectedIndex === index ? 'opacity-100' : 'opacity-50'" @click="selectedIndex = index">
                                <div class="absolute -left-6">
                                    <hr class="border-b border-black transition-all duration-200" :class="selectedIndex === index ? 'w-4' : 'w-1'" />
                                </div>
                                <div class="text-2xl">
                                    {{ house[1] }}
                                </div>
                            </div>
                        </a>
                    </div>
                </template>
            </div>
            <div class="space-y-28" ref="roomsList">
                <template v-for="(house, index) in houses" :key="index">
                    <div v-in-viewport="'fade-animation'" class="h-80 flex" ref="roomDisplay">
                        <a class="anchor" :id="house[1]" />
                        <img class="h-full w-112 object-cover" :src="house[0]" />
                        <div class="p-12 space-y-4">
                            <p class="text-3xl">
                                {{ house[1] }}
                            </p>
                            <div class="text-sm space-x-1 flex items-center">
                                <p>
                                    {{ house[2] }}
                                </p>
                                <hr class="transform rotate-90 border border-gray-300 w-4" />
                                <p>
                                    {{ house[3] }}
                                </p>
                                <hr class="transform rotate-90 border border-gray-300 w-4" />
                                <p>
                                    {{ house[4] }}
                                </p>
                            </div>
                            <div class="text-sm w-72">
                                {{ house[5] }}
                            </div>
                            <WaveButton buttontext="Learn More" />
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped lang="postcss" src="./ApartmentsView.pcss" />

<script lang="ts" src="./ApartmentsView.ts" />
