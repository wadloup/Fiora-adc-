param(
  [string]$PiperPath = "C:\Users\Lotfi\AppData\Local\Python\pythoncore-3.14-64\Scripts\piper.exe",
  [string]$ModelPath = "C:\tts\voices\en_GB-alba-medium.onnx",
  [string]$ConfigPath = "C:\tts\voices\en_GB-alba-medium.onnx.json",
  [string]$OutputDir = "C:\Users\Lotfi\OneDrive\Bureau\clip guide LoL\fira adc\Fiora-adc-git\public\voices\blocks"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ModelPath)) {
  throw "Model not found: $ModelPath"
}

if (-not (Test-Path $ConfigPath)) {
  throw "Config not found: $ConfigPath"
}

if (-not (Test-Path $PiperPath)) {
  throw "Piper not found: $PiperPath"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$entries = @(
  @{
    File = "home-support-shell.wav"
    Text = "Auto win. Netanyahu certified. Support shell. Alistar, Braum, and Yuumi are showcased here as the safest auto win support core."
  },
  @{
    File = "home-identity.wav"
    Text = "Identity. Jewish Friendly. Extermination, stomp, smoke enemy team."
  },
  @{
    File = "home-tone.wav"
    Text = "Tone. Carry mindset. Direct, practical, and written to win lane."
  },
  @{
    File = "home-positioning.wav"
    Text = "Positioning. Technical pocket pick. Pocket pick with a plan, not a meme with excuses."
  },
  @{
    File = "home-use.wav"
    Text = "Use. Champ select read. Best opened in champ select, before the lane starts lying to you."
  },
  @{
    File = "home-support-first.wav"
    Text = "Support first. If your support skips this, half the lane plan is already gone."
  },
  @{
    File = "home-what-you-get.wav"
    Text = "What you get. Runes, build, lane, support, macro, clips. Each page answers a real question instead of wasting your time."
  },
  @{
    File = "home-fiora-energy.wav"
    Text = "Fiora energy. Sharp, smug, unforgiving. One enemy mistake should feel expensive."
  },
  @{
    File = "why-surprise-factor.wav"
    Text = "Surprise factor. Most bot lanes know Fiora top. They do not know how little space she needs before bot lane turns lethal."
  },
  @{
    File = "why-duel-pressure.wav"
    Text = "Duel pressure. One clean opening is enough to make a lane stop feeling annoying and start feeling dangerous."
  },
  @{
    File = "why-execution-edge.wav"
    Text = "Execution edge. Riposte plus support timing turns one enemy mistake into far more value than it should."
  },
  @{
    File = "why-snowball-conversion.wav"
    Text = "Snowball conversion. First lead means wave control, cleaner recalls, dragon setup, and much freer movement."
  },
  @{
    File = "support-alistar.wav"
    Text = "Alistar. Hard engage. Still the cleanest partner here. He gives direct target access and makes commit windows obvious."
  },
  @{
    File = "support-braum.wav"
    Text = "Braum. Dive and peel. Messier than Alistar but still excellent. He protects entry, stabilizes chaos, and lets you keep fighting after first contact."
  },
  @{
    File = "support-yuumi.wav"
    Text = "Yuumi. Sustain and scaling. Special case. She gives sustain, chase comfort, and enough padding to survive until Fiora can re-enter again and again."
  },
  @{
    File = "support-principle-engage-hook.wav"
    Text = "Engage hook. If support can force contact, Fiora gets to play. If not, half the lane is spent asking for permission."
  },
  @{
    File = "support-principle-hydra-timing.wav"
    Text = "Hydra timing. Once Ravenous Hydra is done, repeat pressure gets much easier because Fiora can heal, reset, and walk back in fast."
  },
  @{
    File = "support-principle-protective-supports.wav"
    Text = "Protective supports. They still work when the lane plan is survive early, keep health high, then punish later with cleaner entries."
  },
  @{
    File = "runes-pta-page.wav"
    Text = "P T A page. Why P T A. Best when lane can be decided by one short, brutal trade. Secondary. Biscuits and Jack steady the lane when it gets ugly. Mini. Adaptive, adaptive, and health for early damage that still feels honest."
  },
  @{
    File = "runes-phase-rush-page.wav"
    Text = "Phase Rush page. Why Phase Rush. Take this when sticking, weaving out, or re-entering matters more than raw burst. Damage. Absolute Focus and Last Stand keep the page useful at both clean and messy health bars. Mini. Attack speed, adaptive, and health for smoother access and less clunky trades."
  },
  @{
    File = "build-core-route.wav"
    Text = "Core route. Tiamat into Ravenous Hydra gives sustain, shove, and the freedom to take ugly trades without staying ugly for long."
  },
  @{
    File = "build-snowball-route.wav"
    Text = "Snowball route. Take this when you can actually touch the target and finish before the lane resets."
  },
  @{
    File = "build-stable-route.wav"
    Text = "Stable route. For games where pure greed gets you deleted before the second rotation."
  },
  @{
    File = "build-safe-burst-route.wav"
    Text = "Safe burst route. Burst with a little insurance when you still need safer entries."
  },
  @{
    File = "build-defensive-adaptation.wav"
    Text = "Defensive adaptation. Death's Dance into A D, Maw into A P, and Iceborn when the game demands something uglier and sturdier."
  },
  @{
    File = "build-late-finish.wav"
    Text = "Late finish. Shojin if you want pressure, Guardian Angel if one death loses the game, Bloodthirster if you just want to keep cutting."
  },
  @{
    File = "skill-order-level-1.wav"
    Text = "Level 1. Q for access, repositioning, and creating your first real angle."
  },
  @{
    File = "skill-order-level-2.wav"
    Text = "Level 2. W first for safety. Many lanes are double range or engage, and if they hit level 2 first they will force the classic spike off one wave plus three melee minions. Once you match level 2, Riposte gives you far more freedom to stand in front and protect an enchanter from hook lanes."
  },
  @{
    File = "skill-order-level-3.wav"
    Text = "Level 3. E turns short trades nasty. With P T A, Q in, auto, E reset, auto, then second E crit can chunk absurdly hard. If support gives move speed and cover, you get first contact and Riposte stops the answer back."
  },
  @{
    File = "matchup-jhin.wav"
    Text = "Jhin. Favorable. Danger medium. He does not D P S check you early and many Jhin players waste their crowd control at close range. Hold Riposte for the spell that matters, then stun him and the kill is often almost guaranteed if support is awake."
  },
  @{
    File = "matchup-jinx.wav"
    Text = "Jinx. Favorable. Danger medium. Her W is usually easy to sidestep with Q or just clean movement. The real key is traps. If she drops them directly on you, you have about half a second to parry and stun her back. Until traps are gone, do not waste Riposte."
  },
  @{
    File = "matchup-draven.wav"
    Text = "Draven. Difficult. Danger high. He can harass you far too easily with autos, so early levels are mostly about not donating health for ego. From level 3 onward, one solid engage can still surprise him, especially when he walks up under your tower like he owns the lane."
  },
  @{
    File = "matchup-twitch.wav"
    Text = "Twitch. Difficult. Danger high. His stealth makes tower pressure dangerous. If he vanishes while you are hitting tower and you Q, tagging him by accident can draw tower aggro and get you killed. Later his ultimate gives him extra kite space, so Q into Riposte slow is often the cleanest way to keep contact."
  },
  @{
    File = "matchup-braum.wav"
    Text = "Braum. Difficult. Danger high. He is tanky enough that brute forcing him is usually a waste, and he will try to body block you away from his A D C. The window is when he commits his passive or stun. Parry it, then angle Riposte through him if possible so the enemy A D C gets caught too."
  },
  @{
    File = "matchup-lulu.wav"
    Text = "Lulu. Difficult. Danger high. Polymorph can completely cancel your entry and is awkward to parry on reaction. Respect the spell, stay patient, and do not start a trade you cannot finish before she turns you into decoration."
  },
  @{
    File = "matchup-caitlyn.wav"
    Text = "Caitlyn. Difficult. Danger high. Her range makes lane annoying enough that Doran's Shield is often the clean start just to keep health honest. Play around her traps so you can turn them against her with Riposte, and remember she is still squishy enough that one all in can force everything, even Flash."
  },
  @{
    File = "matchup-ezreal.wav"
    Text = "Ezreal. Difficult. Danger medium. His dash makes the lane slippery and annoying because he can outspace lazy entries for free. Ask support for move speed when possible, then use Riposte slow to stay on him. If he dashes at close range, Q first and W right after often keeps the chase simple."
  },
  @{
    File = "lane-primary-goal.wav"
    Text = "Primary goal. Preserve health. Do not waste health before the real engage window exists."
  },
  @{
    File = "lane-first-spikes.wav"
    Text = "First spikes. Level 2 and 3. Q and E pressure first, Riposte confidence second."
  },
  @{
    File = "lane-vision-rule.wav"
    Text = "Vision rule. Ward first. Control the lane space before converting into aggression."
  },
  @{
    File = "lane-early-lane.wav"
    Text = "Early lane. Keep your health, track the spike, then cash in on the first real mistake. Fiora A D C is short range, so free damage is how you lose lane before the matchup even starts. Level 2 is usually W for safety because double range lanes and engage lanes will gladly abuse the first spike if you cannot answer it. Level 3 brings E, which means the short burst window becomes real the second support gives access or movement speed."
  },
  @{
    File = "lane-wave-bush-control.wav"
    Text = "Wave and bush control. Brush and wave state decide whether your all in is real or just roleplay. Brush control creates hidden engage angles and often bleeds enemy cooldowns before the real fight. If enemy Flash is burned, the next longer wave becomes one of the cleanest jungle punish timings you get. Into ranged lanes, keep your health first and do not turn annoyance into desperate trades."
  },
  @{
    File = "lane-support-sync.wav"
    Text = "Support sync. Support timing matters more here than on a normal marksman lane. Engage and hook supports are premium because they let Fiora touch the target on purpose, not by miracle. After Ravenous Hydra, repeat pressure becomes much easier because Fiora can heal, reset, and walk back in faster. Protective supports still work if the plan is survive early, stay healthy, and punish later with cleaner entries."
  },
  @{
    File = "lane-matchup-trend.wav"
    Text = "Matchup trend. Treat labels as tendencies. Gold, tempo, and support timing rewrite lanes quickly. Favorable trends include Jhin, Jinx, Kai'Sa, Lucian, Senna, Sivir, and Miss Fortune. Harder trends include Ashe, Draven, Kog'Maw, Varus, Vayne, Twitch, and Caitlyn. Most lanes become much more playable once Fiora gets first lead, better tempo, or stronger support timing."
  },
  @{
    File = "mid-late-pick-one-plan.wav"
    Text = "Pick one plan. Split, flank, pick, or group. Mixing all four plans is how leads evaporate."
  },
  @{
    File = "mid-late-entry-timing.wav"
    Text = "Entry timing. Do not enter because enemies are visible. Enter because vision is set and the cooldowns that matter are gone."
  },
  @{
    File = "mid-late-conversion.wav"
    Text = "Conversion. If a fight wins nothing, it barely counts. Turn kills into tempo, towers, dragon, or side space."
  },
  @{
    File = "mechanics-spacing.wav"
    Text = "Spacing. Threaten first. Commit second. Good spacing makes the enemy spend the wrong cooldown before the fight even starts."
  },
  @{
    File = "mechanics-riposte-timing.wav"
    Text = "Riposte timing. Do not parry the loudest spell. Parry the one that decides whether you live, stick, or lose the whole trade."
  },
  @{
    File = "mechanics-burst-windows.wav"
    Text = "Burst windows. When support timing, target access, and wave state line up, go all the way in. Half entries lose lanes."
  },
  @{
    File = "mechanics-vital-angle.wav"
    Text = "Vital angle. Use movement to open cleaner vitals before you hard commit whenever the lane actually gives you room."
  },
  @{
    File = "videos-entry-clip.wav"
    Text = "Entry clip. Look for how the target gets pinned before Fiora spends everything. The clip should start before the fight, not on the first crit frame."
  },
  @{
    File = "videos-spacing-clip.wav"
    Text = "Spacing clip. Look for what changes in movement right before the lane flips from neutral to lethal. A good clip here teaches distance control, not just confidence."
  },
  @{
    File = "videos-cleanup-clip.wav"
    Text = "Cleanup clip. Look for how the kill becomes wave control, reset tempo, or the next target. The ending matters less than the chain of decisions that made it free."
  }
)

$tempDir = Join-Path $PSScriptRoot ".tts-block-temp"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

try {
  foreach ($entry in $entries) {
    $tempTextPath = Join-Path $tempDir ($entry.File + ".txt")
    $outputPath = Join-Path $OutputDir $entry.File

    Set-Content -Path $tempTextPath -Value $entry.Text -NoNewline
    Get-Content $tempTextPath | & $PiperPath --model $ModelPath --config $ConfigPath --output_file $outputPath
  }
}
finally {
  if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
  }
}
