import React, {useState, useContext, useEffect } from 'react'

import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Typography,
  IconButton,
  Paper
} from '@material-ui/core'
import ReplayIcon from '@material-ui/icons/Replay'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import Context from '../../boot/context'

const Data = require('../../boot/data.json')

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
    flexGrow: 1
  }
}))

const clsError = {
  validateRoom: 'Error validate by position room (block - rooms)',
  validateLinks: 'Name room not found in rooms object (block - links)',
  validateWays: 'Name room not found in rooms object (block - ways)',
  validateAnts: 'Name ants in way is not validate (block - ways',
  validateCount: 'Not Validate count Ants',
  main: 'Not parse'
}

export default function MetaLemin ({
  step,
  setStep,
  state,
  setState,
  links,
  setLinks,
  ants,
  setAnts,
  countAnts,
  setCountAnts,
  updateGraph,
  setUpdateGraph,
  ...props
}) {
  const { height } = useContext(Context)

  const classes = useStyles()
  const [dataMeta, setDataMeta] = useState(Data.meta)
  const [isPlay, setIsPlay] = useState(false)
  const [scale, setScale] = useState(20)

  const alert = str => {
    console.log(str)
  }

  const parse = () => {
    const [roomsT, linksT, waysT, countAntsT, error] = goParse()
    if (error || !linksT || !roomsT || !waysT) {
      alert(error)
      setState({})
      setLinks([])
      setAnts([])
      setCountAnts(0)
    } else {
      setState(roomsT)
      setLinks(linksT)
      setAnts(waysT)
      setCountAnts(countAntsT)
    }
    setUpdateGraph(updateGraph + 1)
    setStep(-1)
  }

  const goParse = () => {
    const parseRooms = line => {
      const parseRoom = () => {
        const [name, x, y] = line.split(' ')
        if (!name || !x || !y) return { error: clsError.main }
        else if (isNaN(Number(x)) || isNaN(Number(y)))
          return { error: clsError.validateRoom }
        else
          return {
            name: name,
            x: Number(x) * scale,
            y: Number(y) * scale,
            type: ex
          }
      }
      if (!line) return alert(clsError.main)
      if (line === '##start') ex = -1
      else if (line === '##end') ex = 1
      else if (line[0] !== '#') {
        let roomTemp = parseRoom(line, ex)
        if (roomTemp['error']) {
          isRef = 1
          return roomTemp.error
        } else rooms[roomTemp.name] = roomTemp
        ex = 0
      }
      index += 1
      isRef = 0
      return clsError.main
    }

    const parseLinks = line => {
      const [room1, room2] = line.split('-')
      if (line && line.indexOf('#') === 0) {
        index += 1
        return clsError.main
      }
      if (room1 && room2) {
        if (rooms[room1] && rooms[room2]) {
          links.push([room1, room2])
          index += 1
          return clsError.main
        } else {
          isRef = 2
          return clsError.validateLinks
        }
      }
      isRef = 2
      return clsError.main
    }

    const parseWays = line => {
      const oneStep = line.split(' ')
      if (line && line.indexOf('#') === 0) {
        index += 1
        return clsError.main
      }
      const step = []
      let i = -1
      while (++i < oneStep.length) {
        if (oneStep[i] !== '') {
          let [nameAnt, nameRoom] = oneStep[i].split('-')
          if (
            isNaN(Number(nameAnt.substr(1))) ||
            Number(nameAnt.substr(1)) > count_ants ||
            Number(nameAnt.substr(1)) < 0
          )
            return clsError.validateAnts
          // console.log(nameRoom, rooms[nameRoom], oneStep)
          if (!(nameRoom && rooms[nameRoom])) return clsError.validateWays
          step.push(oneStep[i])
        }
      }
      if (step.length) ways.push(step)
      index += 1
      return clsError.main
    }

    const parseCount = line => {
      if (isNaN(Number(line))) {
        return clsError.validateCount
      }
      count_ants = Number(line)
      isRef = 0
      index += 1
      return clsError.main
    }

    let rowData = dataMeta.split('\n')
    if (isNaN(Number(rowData[0])))
      return [null, null, null, null, clsError.main]
    let count_ants = 0
    let rooms = {}
    let links = []
    let ways = []
    let index = 0
    let isRef = -1
    let ex = -1
    let error = clsError.main
    while (index < rowData.length) {
      if (isRef === -1) error = parseCount(rowData[index])
      if (error !== clsError.main) return [null, null, null, null, error]
      if (isRef === 0) error = parseRooms(rowData[index])
      if (error !== clsError.main) return [null, null, null, null, error]
      if (isRef === 1) error = parseLinks(rowData[index])
      if (error !== clsError.main) return [null, null, null, null, error]
      if (isRef === 2) error = parseWays(rowData[index])
      if (error !== clsError.main) return [null, null, null, null, error]
    }
    return [rooms, links, ways, count_ants, null]
  }

  useEffect(() => {
    if (step < ants.length && isPlay) {
      setTimeout(() => {
        setStep(step + 1)
      }, 1500)
    } else if (step === ants.length && isPlay) {
      setIsPlay(!isPlay)
      setStep(-1)
    }
  }, [step])

  const goPlay = () => {
    setStep(step + 1)
    setIsPlay(!isPlay)
  }

  return (
    <Grid container>
      <Grid>
        <Typography color={'primary'} style={{ margin: 8 }} align={'center'}>
          {'Edit meta'}
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        style={{
          overflowY: 'scroll',
          maxHeight: height - 310,
          minHeight: height - 310
        }}
      >
        <TextField
          className={classes.margin}
          value={dataMeta}
          onChange={e => setDataMeta(e.target.value)}
          label='Meta Lemin'
          multiline
          variant='outlined'
        />
      </Grid>
      <Grid container direction={'column'}>
        <Grid container>
          <TextField
            className={classes.margin}
            id='standard-number'
            label='Coordinate multiplier'
            type='number'
            variant='outlined'
            value={scale}
            onChange={e => setScale(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>
        <Grid container>
          <Button
            className={classes.margin}
            variant='outlined'
            color='primary'
            onClick={e => parse()}
          >
            {'Parse'}
          </Button>
        </Grid>
        <Grid>
          <Paper elevation={1} variant='outlined' style={{ margin: 8 }}>
            <div className={classes.controls}>
              <IconButton
                aria-label='previous'
                onClick={e => {
                  setStep(-1)
                }}
              >
                <ReplayIcon className={classes.playIcon} />
              </IconButton>
              <IconButton onClick={e => goPlay()}>
                <PlayArrowIcon className={classes.playIcon} />
              </IconButton>

              <IconButton
                onClick={e => {
                  step <= ants.length + 5 ? setStep(step + 1) : setStep(-1)
                }}>
                <SkipNextIcon className={classes.playIcon} />
              </IconButton>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  )
}
