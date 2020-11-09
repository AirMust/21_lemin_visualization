import React, { useState, useRef } from 'react'
import { Paper, Grid, makeStyles } from '@material-ui/core'
import MetaLemin from './MetaLemin/MetaLemin'
import GraphLemin from './GraphLemin/GraphLemin'
const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(1),
    flexGrow: 1,
    display: 'flex',
  }
}))

export default function MainContent () {
  const classes = useStyles()
  const ob = useRef(null)

  const [step, setStep] = useState(-1)
  const [state, setState] = useState({})
  const [links, setLinks] = useState([])
  const [ants, setAnts] = useState([])
  const [countAnts, setCountAnts] = useState(0)
  const [updateGraph, setUpdateGraph] = useState(0)

  return (
    <Grid container xs={12} item>
      <Grid container xs={3} item>
        <Paper elevation={3} className={classes.paper}>
          <MetaLemin
            step={step}
            setStep={setStep}
            state={state}
            setState={setState}
            links={links}
            setLinks={setLinks}
            ants={ants}
            setAnts={setAnts}
            countAnts={countAnts}
            setCountAnts={setCountAnts}
            updateGraph={updateGraph}
            setUpdateGraph={setUpdateGraph}
          />
        </Paper>
      </Grid>
      <Grid container xs={9} item>
        <Paper elevation={3} className={classes.paper} ref={ob}>
          <GraphLemin
            key={'graphLemin' + updateGraph}
            width={ob}
            step={step}
            setStep={setStep}
            state={state}
            setState={setState}
            links={links}
            setLinks={setLinks}
            ants={ants}
            setAnts={setAnts}
            countAnts={countAnts}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}
