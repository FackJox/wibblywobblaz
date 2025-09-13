"use client"

import { useState } from "react"
import { CheckedState } from "@radix-ui/react-checkbox"
import { Checkbox } from "../../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Switch } from "../../components/ui/switch"
import { Slider } from "../../components/ui/slider"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { css } from "../../styled-system/css"

export default function TestFormControls() {
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [radioValue, setRadioValue] = useState("option1")
  const [switchOn, setSwitchOn] = useState(false)
  const [sliderValue, setSliderValue] = useState([50])

  return (
    <div className={css({
      minH: "screen",
      bg: "background",
      color: "foreground",
      p: "fluid-lg"
    })}>
      <div className={css({
        maxW: "4xl",
        mx: "auto",
        py: "fluid-2xl"
      })}>
        <h1 className={css({
          fontSize: "fluid-6xl",
          fontWeight: "bold",
          mb: "fluid-2xl",
          textAlign: "center"
        })}>
          Form Controls Test
        </h1>

        <div className={css({
          display: "grid",
          gap: "fluid-xl",
          gridTemplateColumns: { base: "1", md: "2" }
        })}>
          {/* Checkbox Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Checkbox Component</CardTitle>
              <CardDescription>
                Test checkbox with different sizes and states
              </CardDescription>
            </CardHeader>
            <CardContent className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
              <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                <Checkbox 
                  id="checkbox-sm"
                  size="sm"
                  checked={checkboxChecked}
                  onCheckedChange={(checked: CheckedState) => {
                    setCheckboxChecked(checked === true)
                  }}
                />
                <Label htmlFor="checkbox-sm" size="sm">Small checkbox</Label>
              </div>
              
              <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                <Checkbox 
                  id="checkbox-md"
                  size="md"
                  checked={checkboxChecked}
                  onCheckedChange={(checked: CheckedState) => {
                    setCheckboxChecked(checked === true)
                  }}
                />
                <Label htmlFor="checkbox-md" size="md">Medium checkbox (default)</Label>
              </div>
              
              <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                <Checkbox 
                  id="checkbox-lg"
                  size="lg"
                  checked={checkboxChecked}
                  onCheckedChange={(checked: CheckedState) => {
                    setCheckboxChecked(checked === true)
                  }}
                />
                <Label htmlFor="checkbox-lg" size="lg">Large checkbox</Label>
              </div>
              
              <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                <Checkbox 
                  id="checkbox-disabled"
                  disabled
                />
                <Label htmlFor="checkbox-disabled">Disabled checkbox</Label>
              </div>
              
              <p className={css({ fontSize: "sm", color: "muted.foreground" })}>
                Checkbox state: {checkboxChecked ? "checked" : "unchecked"}
              </p>
            </CardContent>
          </Card>

          {/* Radio Group Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Radio Group Component</CardTitle>
              <CardDescription>
                Test radio group with different orientations and sizes
              </CardDescription>
            </CardHeader>
            <CardContent className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
              <div>
                <Label size="md" weight="semibold">Vertical Radio Group (Small)</Label>
                <RadioGroup
                  orientation="vertical"
                  spacing="normal"
                  value={radioValue}
                  onValueChange={setRadioValue}
                  className={css({ mt: "2" })}
                >
                  <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                    <RadioGroupItem value="option1" id="r1" size="sm" />
                    <Label htmlFor="r1" size="sm">Option 1</Label>
                  </div>
                  <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                    <RadioGroupItem value="option2" id="r2" size="sm" />
                    <Label htmlFor="r2" size="sm">Option 2</Label>
                  </div>
                  <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                    <RadioGroupItem value="option3" id="r3" size="sm" />
                    <Label htmlFor="r3" size="sm">Option 3</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label size="md" weight="semibold">Horizontal Radio Group (Large)</Label>
                <RadioGroup
                  orientation="horizontal"
                  spacing="loose"
                  value={radioValue}
                  onValueChange={setRadioValue}
                  className={css({ mt: "2" })}
                >
                  <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                    <RadioGroupItem value="A" id="rA" size="lg" />
                    <Label htmlFor="rA" size="lg">A</Label>
                  </div>
                  <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                    <RadioGroupItem value="B" id="rB" size="lg" />
                    <Label htmlFor="rB" size="lg">B</Label>
                  </div>
                  <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                    <RadioGroupItem value="C" id="rC" size="lg" />
                    <Label htmlFor="rC" size="lg">C</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <p className={css({ fontSize: "sm", color: "muted.foreground" })}>
                Selected: {radioValue}
              </p>
            </CardContent>
          </Card>

          {/* Switch Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Switch Component</CardTitle>
              <CardDescription>
                Test switch with different sizes and animations
              </CardDescription>
            </CardHeader>
            <CardContent className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
              <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                <Switch 
                  id="switch-sm"
                  size="sm"
                  checked={switchOn}
                  onCheckedChange={setSwitchOn}
                />
                <Label htmlFor="switch-sm" size="sm">Small switch</Label>
              </div>
              
              <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                <Switch 
                  id="switch-md"
                  size="md"
                  checked={switchOn}
                  onCheckedChange={setSwitchOn}
                />
                <Label htmlFor="switch-md" size="md">Medium switch (default)</Label>
              </div>
              
              <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                <Switch 
                  id="switch-lg"
                  size="lg"
                  checked={switchOn}
                  onCheckedChange={setSwitchOn}
                />
                <Label htmlFor="switch-lg" size="lg">Large switch</Label>
              </div>
              
              <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                <Switch 
                  id="switch-disabled"
                  disabled
                />
                <Label htmlFor="switch-disabled">Disabled switch</Label>
              </div>
              
              <p className={css({ fontSize: "sm", color: "muted.foreground" })}>
                Switch state: {switchOn ? "on" : "off"}
              </p>
            </CardContent>
          </Card>

          {/* Slider Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Slider Component</CardTitle>
              <CardDescription>
                Test slider with different sizes and orientations
              </CardDescription>
            </CardHeader>
            <CardContent className={css({ display: "flex", flexDirection: "column", gap: "6" })}>
              <div>
                <Label size="md" weight="semibold">Horizontal Slider (Small Track)</Label>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  className={css({ mt: "2" })}
                  trackSize="sm"
                  thumbSize="sm"
                />
              </div>
              
              <div>
                <Label size="md" weight="semibold">Horizontal Slider (Medium Track)</Label>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  className={css({ mt: "2" })}
                  trackSize="md"
                  thumbSize="md"
                />
              </div>
              
              <div>
                <Label size="md" weight="semibold">Horizontal Slider (Large Track)</Label>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  className={css({ mt: "2" })}
                  trackSize="lg"
                  thumbSize="lg"
                />
              </div>
              
              <div className={css({ display: "flex", gap: "4" })}>
                <div>
                  <Label size="md" weight="semibold">Vertical Slider</Label>
                  <Slider
                    orientation="vertical"
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    max={100}
                    step={1}
                    className={css({ mt: "2" })}
                  />
                </div>
                <div>
                  <Label size="md" weight="semibold">Disabled Slider</Label>
                  <Slider
                    value={[25]}
                    max={100}
                    step={1}
                    disabled
                    className={css({ mt: "2" })}
                  />
                </div>
              </div>
              
              <p className={css({ fontSize: "sm", color: "muted.foreground" })}>
                Slider value: {sliderValue[0]}
              </p>
            </CardContent>
          </Card>

          {/* Label Tests */}
          <Card className={css({ gridColumn: { md: "span 2" } })}>
            <CardHeader>
              <CardTitle>Label Component</CardTitle>
              <CardDescription>
                Test label with different sizes and weights
              </CardDescription>
            </CardHeader>
            <CardContent className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
              <div className={css({ display: "grid", gridTemplateColumns: { base: "1", sm: "3" }, gap: "4" })}>
                <div>
                  <Label size="sm" weight="normal">Small Normal</Label>
                  <br />
                  <Label size="sm" weight="medium">Small Medium</Label>
                  <br />
                  <Label size="sm" weight="semibold">Small Semibold</Label>
                  <br />
                  <Label size="sm" weight="bold">Small Bold</Label>
                </div>
                
                <div>
                  <Label size="md" weight="normal">Medium Normal</Label>
                  <br />
                  <Label size="md" weight="medium">Medium Medium</Label>
                  <br />
                  <Label size="md" weight="semibold">Medium Semibold</Label>
                  <br />
                  <Label size="md" weight="bold">Medium Bold</Label>
                </div>
                
                <div>
                  <Label size="lg" weight="normal">Large Normal</Label>
                  <br />
                  <Label size="lg" weight="medium">Large Medium</Label>
                  <br />
                  <Label size="lg" weight="semibold">Large Semibold</Label>
                  <br />
                  <Label size="lg" weight="bold">Large Bold</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className={css({ 
          display: "flex", 
          gap: "4", 
          justifyContent: "center", 
          mt: "fluid-2xl" 
        })}>
          <Button 
            onClick={() => {
              setCheckboxChecked(!checkboxChecked)
              setRadioValue("option1")
              setSwitchOn(!switchOn)
              setSliderValue([Math.floor(Math.random() * 100)])
            }}
          >
            Randomize Values
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setCheckboxChecked(false)
              setRadioValue("option1")
              setSwitchOn(false)
              setSliderValue([50])
            }}
          >
            Reset All
          </Button>
        </div>
      </div>
    </div>
  )
}