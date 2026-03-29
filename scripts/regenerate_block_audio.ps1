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
    Text = "Identity. Jewish Friendly. Dark red, duel heavy, and built to feel hostile."
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
