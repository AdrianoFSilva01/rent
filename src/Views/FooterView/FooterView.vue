<template>
    <div class="flex bg-gold p-36 space-x-10">
        <div class="space-y-6 flex-grow">
            <div class="flex-grow">
                <p class="text-white text-3xl">
                    Stay up to date.
                </p>
            </div>
            <div class="flex space-x-40">
                <div class="space-y-8 w-64">
                    <Input type="email" placeholder-text="First Name" />
                    <Input placeholder-text="Second Name" />
                    <Input placeholder-text="Email Adress" />
                    <div class="flex items-center space-x-4 cursor-pointer" @click="toggleCheckbox">
                        <div class="border bg-transparent border-white w-2.5 h-2.5 p-0.5">
                            <div ref="checkbox" class="bg-white transition-all duration-main transform w-0 h-0" />
                        </div>
                        <span class="text-xs text-white">
                            By submitting this form, you accept our privacy policy.
                        </span>
                    </div>
                    <WaveButton class="border-white" background-color="white" text-color="white" text-hover-color="#d6a159" buttontext="Send" />
                </div>
                <div class="flex space-x-8">
                    <span class="text-white text-sm opacity-50">
                        M
                    </span>
                    <span class="text-white text-sm">
                        info@madeira.pt
                    </span>
                </div>
                <div class="space-y-2">
                    <router-link to="/apartments" @click="backToTop">
                        <UnderlineText class="text-sm text-white" text="Apartments" />
                    </router-link>
                    <UnderlineText class="text-sm text-white" text="Our House" />
                </div>
                <div class="space-y-2">
                    <UnderlineText class="text-sm text-white" text="Contact & Directions" />
                    <UnderlineText class="text-sm text-white w-auto" text="Imprint" />
                </div>
                <div class="space-y-2">
                    <UnderlineText class="text-sm text-white" text="Terms" />
                    <UnderlineText class="text-sm text-white" text="Privacy" />
                </div>
            </div>
            <div>
                <div class="flex space-x-6 mt-14">
                    <div class="social-media text-gold hover:text-white">
                        <div class="icon facebook-icon bg-white">
                            <svg viewBox="0 0 100 100">
                                <use href="@/Assets/Images/facebook.svg#facebook" />
                            </svg>
                        </div>
                        <span class="text-sm text-white">
                            Facebook
                        </span>
                    </div>
                    <div class="social-media text-white hover:text-gold">
                        <div class="icon instagram-icon p-1">
                            <svg viewBox="0 0 100 100">
                                <use href="@/Assets/Images/instagram.svg#instagram" />
                            </svg>
                        </div>
                        <span class="text-sm text-white">
                            Instagram
                        </span>
                    </div>
                    <div class="flex-grow text-right text-sm text-white opacity-50">
                        Copyright ©
                        Made by Adriano
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="flex items-center space-x-6 transform rotate-90 cursor-pointer" @click="backToTop">
                <div class="relative w-5 h-auto">
                    <hr class="w-2 absolute transform rotate-45 origin-bottom-left" />
                    <hr class="w-full absolute" />
                    <hr class="w-2 absolute transform -rotate-45 origin-top-left" />
                </div>
                <p class="text-white text-xs">
                    BACK TO TOP
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./FooterView.ts" />

<style scoped lang="postcss" src="./FooterView.pcss" />
